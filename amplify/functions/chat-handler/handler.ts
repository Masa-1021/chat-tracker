import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { buildSystemPrompt, buildTitleGenerationPrompt } from './prompt'
import type {
  BedrockContentBlock,
  BedrockMessage,
  ChatHandlerEvent,
  ThemeField,
} from './types'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

const bedrockClient = new BedrockRuntimeClient({
  region: getEnv('BEDROCK_REGION'),
})
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export const handler = async (event: ChatHandlerEvent) => {
  const { sessionId, content, images } = event.arguments
  const userId = event.identity.sub

  // 1. Get session & theme info
  const session = await getSession(sessionId)
  if (!session) {
    throw new Error('AI_SESSION_NOT_FOUND')
  }
  if (session.userId !== userId) {
    throw new Error('AI_UNAUTHORIZED')
  }

  const theme = await getTheme(session.themeId)
  if (!theme) {
    throw new Error('AI_THEME_NOT_FOUND')
  }

  const messages = await getMessages(sessionId)

  // 2. Save user message
  const userMessage = await saveMessage(sessionId, 'USER', content, images)

  // 3. Analyze collected data
  const themeFields: ThemeField[] =
    typeof theme.fields === 'string'
      ? JSON.parse(theme.fields)
      : theme.fields
  const collectedData = analyzeCollectedData(messages, themeFields)

  // 4. Build system prompt
  const systemPrompt = buildSystemPrompt(theme.name, themeFields, collectedData)

  // 5. Stream Bedrock response
  const messageId = generateId()
  let fullContent = ''
  let chunkIndex = 0

  const bedrockMessages = formatMessagesForBedrock(messages, content, images)

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: getEnv('BEDROCK_MODEL_ID'),
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: parseInt(getEnv('BEDROCK_MAX_TOKENS'), 10),
      system: systemPrompt,
      messages: bedrockMessages,
    }),
  })

  const response = await bedrockClient.send(command)

  // 6. Process streaming response
  if (response.body) {
    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const parsed = JSON.parse(
          new TextDecoder().decode(chunk.chunk.bytes),
        ) as { type: string; delta?: { text?: string } }

        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          fullContent += parsed.delta.text

          await dynamoClient.send(
            new PutCommand({
              TableName: getEnv('STREAMCHUNK_TABLE_NAME'),
              Item: {
                id: `${messageId}-${chunkIndex}`,
                sessionId,
                messageId,
                chunkIndex,
                content: parsed.delta.text,
                isComplete: false,
                timestamp: new Date().toISOString(),
              },
            }),
          )
          chunkIndex++
        }
      }
    }
  }

  // 7. Send completion chunk
  await dynamoClient.send(
    new PutCommand({
      TableName: getEnv('STREAMCHUNK_TABLE_NAME'),
      Item: {
        id: `${messageId}-complete`,
        sessionId,
        messageId,
        chunkIndex,
        content: '',
        isComplete: true,
        timestamp: new Date().toISOString(),
      },
    }),
  )

  // 8. Save full assistant message
  const assistantMessage = await saveMessage(
    sessionId,
    'ASSISTANT',
    fullContent,
  )

  // 9. Update session message count
  await dynamoClient.send(
    new UpdateCommand({
      TableName: getEnv('CHATSESSION_TABLE_NAME'),
      Key: { id: sessionId },
      UpdateExpression:
        'SET messageCount = messageCount + :inc, updatedAt = :now',
      ExpressionAttributeValues: {
        ':inc': 2, // user + assistant
        ':now': new Date().toISOString(),
      },
    }),
  )

  // 10. Auto-generate title (within first 5 messages)
  if (!session.titleLocked && (session.messageCount ?? 0) < 5) {
    const allMessages = [
      ...messages.map((m: Record<string, string>) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'USER', content },
      { role: 'ASSISTANT', content: fullContent },
    ]
    await updateSessionTitle(sessionId, allMessages, session.messageCount + 2)
  }

  return {
    id: assistantMessage.id,
    sessionId,
    messageId,
    content: fullContent,
  }
}

// --- Helper functions ---

async function getSession(sessionId: string) {
  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: getEnv('CHATSESSION_TABLE_NAME'),
      Key: { id: sessionId },
    }),
  )
  return Item as
    | {
        id: string
        userId: string
        themeId: string
        title: string
        titleLocked: boolean
        messageCount: number
        status: string
      }
    | undefined
}

async function getTheme(themeId: string) {
  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: getEnv('THEME_TABLE_NAME'),
      Key: { id: themeId },
    }),
  )
  return Item as
    | { id: string; name: string; fields: ThemeField[] | string }
    | undefined
}

async function getMessages(sessionId: string) {
  const { Items } = await dynamoClient.send(
    new QueryCommand({
      TableName: getEnv('CHATMESSAGE_TABLE_NAME'),
      IndexName: 'sessionId-timestamp-index',
      KeyConditionExpression: 'sessionId = :sid',
      ExpressionAttributeValues: { ':sid': sessionId },
      ScanIndexForward: true,
    }),
  )
  return (Items ?? []) as Array<Record<string, string>>
}

async function saveMessage(
  sessionId: string,
  role: 'USER' | 'ASSISTANT',
  content: string,
  images?: string[],
) {
  const id = generateId()
  const now = new Date().toISOString()
  const item: Record<string, unknown> = {
    id,
    sessionId,
    role,
    content,
    images: images ?? [],
    isStreaming: false,
    timestamp: now,
    createdAt: now,
    updatedAt: now,
  }

  await dynamoClient.send(
    new PutCommand({
      TableName: getEnv('CHATMESSAGE_TABLE_NAME'),
      Item: item,
    }),
  )
  return { id, sessionId, role, content, timestamp: now }
}

function formatMessagesForBedrock(
  history: Array<Record<string, string>>,
  currentContent: string,
  images?: string[],
): BedrockMessage[] {
  const msgs: BedrockMessage[] = history.map((m) => ({
    role: m.role === 'USER' ? 'user' : 'assistant',
    content: [{ type: 'text' as const, text: m.content }],
  }))

  // Build current user message
  const currentBlocks: BedrockContentBlock[] = []
  if (images && images.length > 0) {
    for (const img of images) {
      const mediaType = detectMediaType(img)
      const base64Data = img.replace(/^data:[^;]+;base64,/, '')
      currentBlocks.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64Data },
      })
    }
  }
  currentBlocks.push({ type: 'text', text: currentContent })

  msgs.push({ role: 'user', content: currentBlocks })
  return msgs
}

function detectMediaType(dataUri: string): string {
  if (dataUri.startsWith('data:image/png')) return 'image/png'
  if (dataUri.startsWith('data:image/webp')) return 'image/webp'
  if (dataUri.startsWith('data:image/gif')) return 'image/gif'
  return 'image/jpeg'
}

function analyzeCollectedData(
  messages: Array<Record<string, string>>,
  fields: ThemeField[],
): Record<string, string | null> {
  const data: Record<string, string | null> = {}
  for (const field of fields) {
    data[field.name] = null
  }

  // Simple extraction: look for field values in assistant messages
  const assistantMessages = messages.filter((m) => m.role === 'ASSISTANT')
  if (assistantMessages.length === 0) return data

  const lastAssistant = assistantMessages[assistantMessages.length - 1]
  if (!lastAssistant) return data

  for (const field of fields) {
    const patterns = [
      new RegExp(`【${escapeRegExp(field.name)}】[:：]\\s*(.+)`, 'm'),
      new RegExp(`${escapeRegExp(field.name)}[:：]\\s*(.+)`, 'm'),
    ]
    for (const pattern of patterns) {
      const match = lastAssistant.content.match(pattern)
      if (match?.[1]) {
        const value = match[1].trim()
        if (value && value !== '未入力' && value !== '{収集した値}') {
          data[field.name] = value
          break
        }
      }
    }
  }

  return data
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function updateSessionTitle(
  sessionId: string,
  messages: Array<{ role: string; content: string }>,
  messageCount: number,
) {
  try {
    const titlePrompt = buildTitleGenerationPrompt(messages)

    const command = new InvokeModelWithResponseStreamCommand({
      modelId: getEnv('BEDROCK_MODEL_ID'),
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        messages: [{ role: 'user', content: titlePrompt }],
      }),
    })

    const response = await bedrockClient.send(command)
    let title = ''

    if (response.body) {
      for await (const chunk of response.body) {
        if (chunk.chunk?.bytes) {
          const parsed = JSON.parse(
            new TextDecoder().decode(chunk.chunk.bytes),
          ) as { type: string; delta?: { text?: string } }
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            title += parsed.delta.text
          }
        }
      }
    }

    title = title.trim().split('\n')[0] ?? ''
    if (!title) return

    const shouldLock = messageCount >= 5
    await dynamoClient.send(
      new UpdateCommand({
        TableName: getEnv('CHATSESSION_TABLE_NAME'),
        Key: { id: sessionId },
        UpdateExpression: 'SET title = :t, titleLocked = :locked, updatedAt = :now',
        ExpressionAttributeValues: {
          ':t': title,
          ':locked': shouldLock,
          ':now': new Date().toISOString(),
        },
      }),
    )
  } catch (err) {
    console.error('Failed to generate title:', err)
    // Non-fatal: don't throw
  }
}

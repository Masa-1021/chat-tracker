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
import { buildSystemPrompt, buildTitleGenerationPrompt } from '../chat-handler/prompt'
import type {
  BedrockContentBlock,
  BedrockMessage,
  ThemeField,
  StreamingRequestBody,
  FunctionUrlEvent,
  NdjsonChunk,
} from './types'

declare const awslambda: {
  streamifyResponse: (
    handler: (
      event: FunctionUrlEvent,
      responseStream: NodeJS.WritableStream,
    ) => Promise<void>,
  ) => (event: FunctionUrlEvent) => Promise<void>
  HttpResponseStream: {
    from: (
      stream: NodeJS.WritableStream,
      metadata: {
        statusCode: number
        headers: Record<string, string>
      },
    ) => NodeJS.WritableStream
  }
}

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

function writeChunk(stream: NodeJS.WritableStream, chunk: NdjsonChunk): void {
  stream.write(JSON.stringify(chunk) + '\n')
}

// --- JWT Validation ---

interface JwkKey {
  kid: string
  kty: string
  n: string
  e: string
  alg: string
  use: string
}

interface JwksResponse {
  keys: JwkKey[]
}

interface JwtHeader {
  kid: string
  alg: string
}

interface JwtPayload {
  sub: string
  iss: string
  client_id?: string
  token_use: string
  exp: number
}

let cachedJwks: JwksResponse | null = null

async function getJwks(): Promise<JwksResponse> {
  if (cachedJwks) return cachedJwks
  const userPoolId = getEnv('USER_POOL_ID')
  const region = userPoolId.split('_')[0]
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`)
  cachedJwks = (await res.json()) as JwksResponse
  return cachedJwks
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = Buffer.from(padded, 'base64')
  return new Uint8Array(binary)
}

function decodeJwtParts(token: string): { header: JwtHeader; payload: JwtPayload; signatureInput: string; signature: Uint8Array } {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT format')
  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString()) as JwtHeader
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as JwtPayload
  const signatureInput = `${parts[0]}.${parts[1]}`
  const signature = base64UrlDecode(parts[2])
  return { header, payload, signatureInput, signature }
}

async function importJwk(jwk: JwkKey) {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
}

async function verifyJwt(token: string): Promise<string> {
  const { header, payload, signatureInput, signature } = decodeJwtParts(token)

  // Validate claims
  const userPoolId = getEnv('USER_POOL_ID')
  const clientId = getEnv('USER_POOL_CLIENT_ID')
  const region = userPoolId.split('_')[0]
  const expectedIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

  if (payload.iss !== expectedIssuer) {
    throw new Error('Invalid issuer')
  }
  if (payload.token_use !== 'id') {
    throw new Error('Invalid token_use: expected id token')
  }
  if (payload.client_id && payload.client_id !== clientId) {
    throw new Error('Invalid client_id')
  }
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired')
  }

  // Verify signature
  const jwks = await getJwks()
  const jwk = jwks.keys.find((k) => k.kid === header.kid)
  if (!jwk) throw new Error('No matching JWK found')

  const cryptoKey = await importJwk(jwk)
  const encoder = new TextEncoder()
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    encoder.encode(signatureInput),
  )
  if (!valid) throw new Error('Invalid JWT signature')

  return payload.sub
}

// --- Main Handler ---

export const handler = awslambda.streamifyResponse(
  async (event: FunctionUrlEvent, responseStream: NodeJS.WritableStream) => {
    // CORS headers are handled by Function URL config — do NOT duplicate here
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    }

    // CORS preflight is handled automatically by Function URL config

    if (event.requestContext.http.method !== 'POST') {
      const errStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 405,
        headers: responseHeaders,
      })
      errStream.write(JSON.stringify({ error: 'Method not allowed' }))
      errStream.end()
      return
    }

    // Authenticate
    const authHeader =
      event.headers['authorization'] ?? event.headers['Authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      const errStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 401,
        headers: responseHeaders,
      })
      errStream.write(JSON.stringify({ error: 'Missing or invalid Authorization header' }))
      errStream.end()
      return
    }

    let userId: string
    try {
      userId = await verifyJwt(authHeader.slice(7))
    } catch (err) {
      const errStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 401,
        headers: responseHeaders,
      })
      errStream.write(JSON.stringify({ error: `JWT verification failed: ${(err as Error).message}` }))
      errStream.end()
      return
    }

    // Parse request body
    let body: StreamingRequestBody
    try {
      const rawBody = event.isBase64Encoded
        ? Buffer.from(event.body ?? '', 'base64').toString()
        : event.body ?? ''
      body = JSON.parse(rawBody) as StreamingRequestBody
    } catch {
      const errStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 400,
        headers: responseHeaders,
      })
      errStream.write(JSON.stringify({ error: 'Invalid request body' }))
      errStream.end()
      return
    }

    const { sessionId, content, images } = body

    // Set up NDJSON response stream
    const httpStream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: responseHeaders,
    })

    try {
      // 1. Get session & theme
      const session = await getSession(sessionId)
      if (!session) throw new Error('AI_SESSION_NOT_FOUND')
      if (session.userId !== userId) throw new Error('AI_UNAUTHORIZED')

      const theme = await getTheme(session.themeId)
      if (!theme) throw new Error('AI_THEME_NOT_FOUND')

      const messages = await getMessages(sessionId)

      // 2. Save user message
      await saveMessage(sessionId, 'USER', content, images)

      // 3. Analyze collected data
      const themeFields: ThemeField[] =
        typeof theme.fields === 'string'
          ? JSON.parse(theme.fields)
          : theme.fields
      const collectedData = analyzeCollectedData(messages, themeFields)

      // 4. Build prompt & call Bedrock
      const systemPrompt = buildSystemPrompt(theme.name, themeFields, collectedData)
      const bedrockMessages = formatMessagesForBedrock(messages, content, images)
      const messageId = generateId()
      let fullContent = ''

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

      const bedrockResponse = await bedrockClient.send(command)

      // 5. Stream chunks via NDJSON
      let lastChunkTime = Date.now()
      const PING_INTERVAL = 10_000

      if (bedrockResponse.body) {
        for await (const chunk of bedrockResponse.body) {
          // Send ping if idle
          const now = Date.now()
          if (now - lastChunkTime > PING_INTERVAL) {
            writeChunk(httpStream, { type: 'ping' })
          }
          lastChunkTime = now

          if (chunk.chunk?.bytes) {
            const parsed = JSON.parse(
              new TextDecoder().decode(chunk.chunk.bytes),
            ) as { type: string; delta?: { text?: string } }

            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullContent += parsed.delta.text
              writeChunk(httpStream, {
                type: 'text',
                content: parsed.delta.text,
              })
            }
          }
        }
      }

      // 6. Send done chunk
      writeChunk(httpStream, {
        type: 'done',
        messageId,
        fullContent,
      })

      // 7. Save assistant message & update session (fire-and-forget for stream speed)
      await Promise.all([
        saveMessage(sessionId, 'ASSISTANT', fullContent),
        dynamoClient.send(
          new UpdateCommand({
            TableName: getEnv('CHATSESSION_TABLE_NAME'),
            Key: { id: sessionId },
            UpdateExpression:
              'SET messageCount = messageCount + :inc, updatedAt = :now',
            ExpressionAttributeValues: {
              ':inc': 2,
              ':now': new Date().toISOString(),
            },
          }),
        ),
      ])

      // 8. Auto-generate title
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
    } catch (err) {
      console.error('Streaming handler error:', err)
      writeChunk(httpStream, {
        type: 'error',
        message: (err as Error).message,
      })
    } finally {
      httpStream.end()
    }
  },
)

// --- Helper functions (reused from chat-handler) ---

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
      IndexName: 'chatMessagesBySessionIdAndTimestamp',
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
  }
}

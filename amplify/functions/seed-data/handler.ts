import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

interface ThemeDefinition {
  id: string
  name: string
  fields: {
    id: string
    name: string
    type: string
    required: boolean
    options: string[] | null
    order: number
  }[]
}

const SEED_THEMES: ThemeDefinition[] = [
  {
    id: 'default-trouble-maintenance',
    name: 'トラブルメンテナンス',
    fields: [
      { id: 'f1', name: '発生日時', type: 'DATETIME', required: true, options: null, order: 0 },
      { id: 'f2', name: 'トラブル内容', type: 'TEXTAREA', required: true, options: null, order: 1 },
      { id: 'f3', name: '原因', type: 'TEXTAREA', required: true, options: null, order: 2 },
      { id: 'f4', name: '暫定対策', type: 'TEXTAREA', required: false, options: null, order: 3 },
      { id: 'f5', name: '恒久対策', type: 'TEXTAREA', required: false, options: null, order: 4 },
    ],
  },
  {
    id: 'default-quality-anomaly',
    name: '品質異常報告',
    fields: [
      { id: 'f1', name: '発見日時', type: 'DATETIME', required: true, options: null, order: 0 },
      { id: 'f2', name: '製品名/工程名', type: 'TEXT', required: true, options: null, order: 1 },
      { id: 'f3', name: '異常内容', type: 'TEXTAREA', required: true, options: null, order: 2 },
      { id: 'f4', name: '影響範囲（個数）', type: 'NUMBER', required: true, options: null, order: 3 },
      { id: 'f5', name: '原因区分', type: 'SELECT', required: true, options: ['人', '機械', '材料', '方法', '環境'], order: 4 },
      { id: 'f6', name: '是正処置', type: 'TEXTAREA', required: false, options: null, order: 5 },
    ],
  },
  {
    id: 'default-kaizen-proposal',
    name: '改善提案',
    fields: [
      { id: 'f1', name: '提案日', type: 'DATE', required: true, options: null, order: 0 },
      { id: 'f2', name: '対象工程', type: 'TEXT', required: true, options: null, order: 1 },
      { id: 'f3', name: '現状の問題', type: 'TEXTAREA', required: true, options: null, order: 2 },
      { id: 'f4', name: '改善案', type: 'TEXTAREA', required: true, options: null, order: 3 },
      { id: 'f5', name: '期待効果', type: 'TEXTAREA', required: false, options: null, order: 4 },
    ],
  },
]

interface SeedDataEvent {
  userTableName: string
  themeTableName: string
}

export const handler = async (event: SeedDataEvent) => {
  const { userTableName, themeTableName } = event

  // 1. Create initial admin user (idempotent)
  await seedAdminUser(userTableName)

  // 2. Create seed themes (idempotent per theme)
  await seedThemes(themeTableName)

  return { status: 'done' }
}

async function seedAdminUser(tableName: string) {
  const { Item } = await dynamoClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id: getEnv('INITIAL_ADMIN_USER_ID') },
    }),
  )

  if (Item) {
    console.log('Admin user already exists, skipping')
    return
  }

  const now = new Date().toISOString()
  await dynamoClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: getEnv('INITIAL_ADMIN_USER_ID'),
        email: getEnv('INITIAL_ADMIN_EMAIL'),
        displayName: 'システム管理者',
        role: 'ADMIN',
        language: 'ja',
        displayTheme: 'system',
        createdAt: now,
        updatedAt: now,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    }),
  )
  console.log('Initial admin user created')
}

async function seedThemes(tableName: string) {
  const now = new Date().toISOString()

  for (const theme of SEED_THEMES) {
    // Check if this theme already exists (idempotent)
    const { Item } = await dynamoClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: theme.id },
      }),
    )

    if (Item) {
      console.log(`Theme already exists: ${theme.name}, skipping`)
      continue
    }

    await dynamoClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: theme.id,
          name: theme.name,
          fields: JSON.stringify(theme.fields),
          createdBy: 'SYSTEM',
          usageCount: 0,
          isDefault: true,
          createdAt: now,
          updatedAt: now,
        },
        ConditionExpression: 'attribute_not_exists(id)',
      }),
    )
    console.log(`Seed theme created: ${theme.name}`)
  }
}

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

const DEFAULT_THEME_ID = 'default-trouble-maintenance'

interface SeedDataEvent {
  userTableName: string
  themeTableName: string
}

export const handler = async (event: SeedDataEvent) => {
  const { userTableName, themeTableName } = event

  // 1. Create initial admin user (idempotent)
  await seedAdminUser(userTableName)

  // 2. Create default theme (idempotent)
  await seedDefaultTheme(themeTableName)

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

async function seedDefaultTheme(tableName: string) {
  // Check if any default theme exists
  const { Items } = await dynamoClient.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: 'isDefault = :t',
      ExpressionAttributeValues: { ':t': true },
      Limit: 1,
    }),
  )

  if (Items && Items.length > 0) {
    console.log('Default theme already exists, skipping')
    return
  }

  const now = new Date().toISOString()
  await dynamoClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: DEFAULT_THEME_ID,
        name: 'トラブルメンテナンス',
        fields: JSON.stringify([
          {
            id: 'f1',
            name: '発生日時',
            type: 'DATETIME',
            required: true,
            options: null,
            order: 0,
          },
          {
            id: 'f2',
            name: 'トラブル内容',
            type: 'TEXTAREA',
            required: true,
            options: null,
            order: 1,
          },
          {
            id: 'f3',
            name: '原因',
            type: 'TEXTAREA',
            required: true,
            options: null,
            order: 2,
          },
          {
            id: 'f4',
            name: '暫定対策',
            type: 'TEXTAREA',
            required: false,
            options: null,
            order: 3,
          },
          {
            id: 'f5',
            name: '恒久対策',
            type: 'TEXTAREA',
            required: false,
            options: null,
            order: 4,
          },
        ]),
        createdBy: 'SYSTEM',
        usageCount: 0,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    }),
  )
  console.log('Default theme created: トラブルメンテナンス')
}

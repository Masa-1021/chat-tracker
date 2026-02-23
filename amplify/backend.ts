import { defineBackend } from '@aws-amplify/backend'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'
import { Alarm, ComparisonOperator, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch'
import { CfnOutput, Duration, Stack } from 'aws-cdk-lib'
import { FunctionUrlAuthType, HttpMethod, InvokeMode } from 'aws-cdk-lib/aws-lambda'
import type { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { seedData } from './functions/seed-data/resource'
import { chatHandler } from './functions/chat-handler/resource'
import { streamingChat } from './functions/streaming-chat/resource'
import { ttsFunction } from './functions/tts/resource'

const backend = defineBackend({
  auth,
  data,
  storage,
  seedData,
  chatHandler,
  streamingChat,
  ttsFunction,
})

const stack = Stack.of(backend.chatHandler.resources.lambda)
const accountId = stack.account

// --- Auth: pass Cognito IDs to Lambda functions dynamically ---
const userPool = backend.auth.resources.userPool
const userPoolClient = backend.auth.resources.cfnResources.cfnUserPoolClient

// --- chatHandler: DynamoDB table name env vars & permissions ---
const chatLambda = backend.chatHandler.resources.lambda as LambdaFunction
const tables = backend.data.resources.tables

const tableMapping: Record<string, string> = {
  CHATSESSION_TABLE_NAME: 'ChatSession',
  CHATMESSAGE_TABLE_NAME: 'ChatMessage',
  STREAMCHUNK_TABLE_NAME: 'StreamChunk',
  THEME_TABLE_NAME: 'Theme',
  SAVEDDATA_TABLE_NAME: 'SavedData',
}

for (const [envKey, modelName] of Object.entries(tableMapping)) {
  const table = tables[modelName]
  chatLambda.addEnvironment(envKey, table.tableName)
  table.grantReadWriteData(chatLambda)
  // Amplify Gen 2 の grantReadWriteData が GSI をカバーしない場合に備え
  // 明示的にインデックスへのアクセスを許可
  chatLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:Query',
        'dynamodb:Scan',
      ],
      resources: [`${table.tableArn}/index/*`],
    }),
  )
}

// --- seedData: DynamoDB table permissions ---
const seedLambda = backend.seedData.resources.lambda
tables['User'].grantReadWriteData(seedLambda)
tables['Theme'].grantReadWriteData(seedLambda)

// --- chatHandler: Bedrock invoke permission ---
chatLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel',
      'bedrock:InvokeModelWithResponseStream',
    ],
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.*',
      `arn:aws:bedrock:us-west-2:${accountId}:inference-profile/us.anthropic.*`,
    ],
  }),
)

// --- CloudWatch Alarms: chatHandler monitoring ---
new Alarm(stack, 'ChatHandlerErrorAlarm', {
  metric: chatLambda.metricErrors({ period: Duration.minutes(5) }),
  threshold: 5,
  evaluationPeriods: 1,
  comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  alarmDescription: 'chatHandler Lambda error rate >= 5 in 5 minutes',
})

new Alarm(stack, 'ChatHandlerDurationAlarm', {
  metric: chatLambda.metricDuration({ period: Duration.minutes(5) }),
  threshold: 60_000,
  evaluationPeriods: 2,
  comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  alarmDescription: 'chatHandler Lambda avg duration >= 60s over 2 periods',
})

// --- streamingChat: Function URL + DynamoDB + Bedrock ---
const streamingLambda = backend.streamingChat.resources.lambda as LambdaFunction

// Function URL with response streaming
const fnUrl = streamingLambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  invokeMode: InvokeMode.RESPONSE_STREAM,
  cors: {
    allowedOrigins: [
      'https://main.d3jxjiafwm0rm4.amplifyapp.com',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    allowedHeaders: ['content-type', 'authorization'],
    allowedMethods: [HttpMethod.POST],
  },
})

new CfnOutput(stack, 'StreamingChatFunctionUrl', {
  value: fnUrl.url,
  description: 'Lambda Function URL for streaming chat',
})

// DynamoDB table permissions (no StreamChunk needed, added SavedData for RAG)
const streamingTableMapping: Record<string, string> = {
  CHATSESSION_TABLE_NAME: 'ChatSession',
  CHATMESSAGE_TABLE_NAME: 'ChatMessage',
  THEME_TABLE_NAME: 'Theme',
  SAVEDDATA_TABLE_NAME: 'SavedData',
}

for (const [envKey, modelName] of Object.entries(streamingTableMapping)) {
  const table = tables[modelName]
  streamingLambda.addEnvironment(envKey, table.tableName)
  table.grantReadWriteData(streamingLambda)
  streamingLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:Query', 'dynamodb:Scan'],
      resources: [`${table.tableArn}/index/*`],
    }),
  )
}

// Cognito env vars for JWT verification (dynamic)
streamingLambda.addEnvironment('USER_POOL_ID', userPool.userPoolId)
streamingLambda.addEnvironment('USER_POOL_CLIENT_ID', userPoolClient.ref)

// Bedrock invoke permission
streamingLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel',
      'bedrock:InvokeModelWithResponseStream',
    ],
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.*',
      `arn:aws:bedrock:us-west-2:${accountId}:inference-profile/us.anthropic.*`,
    ],
  }),
)

// --- ttsFunction: Function URL + Polly ---
const ttsLambda = backend.ttsFunction.resources.lambda as LambdaFunction

const ttsFnUrl = ttsLambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  invokeMode: InvokeMode.BUFFERED,
  cors: {
    allowedOrigins: [
      'https://main.d3jxjiafwm0rm4.amplifyapp.com',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    allowedHeaders: ['content-type', 'authorization'],
    allowedMethods: [HttpMethod.POST],
  },
})

new CfnOutput(stack, 'TtsFunctionUrl', {
  value: ttsFnUrl.url,
  description: 'Lambda Function URL for TTS (Amazon Polly)',
})

// Cognito env vars for JWT verification (dynamic)
ttsLambda.addEnvironment('USER_POOL_ID', userPool.userPoolId)
ttsLambda.addEnvironment('USER_POOL_CLIENT_ID', userPoolClient.ref)

// Polly permissions
ttsLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['polly:SynthesizeSpeech'],
    resources: ['*'],
  }),
)

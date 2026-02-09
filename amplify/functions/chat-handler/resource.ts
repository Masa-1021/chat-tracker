import { defineFunction } from '@aws-amplify/backend'

export const chatHandler = defineFunction({
  name: 'chat-handler',
  entry: './handler.ts',
  timeoutSeconds: 120,
  memoryMB: 512,
  environment: {
    BEDROCK_MODEL_ID: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
    BEDROCK_REGION: 'us-west-2',
    BEDROCK_MAX_TOKENS: '4096',
  },
})

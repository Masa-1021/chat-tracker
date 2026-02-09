import { defineFunction } from '@aws-amplify/backend'

export const streamingChat = defineFunction({
  name: 'streaming-chat',
  entry: './handler.ts',
  timeoutSeconds: 120,
  memoryMB: 512,
  resourceGroupName: 'data',
  environment: {
    BEDROCK_MODEL_ID: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
    BEDROCK_REGION: 'us-west-2',
    BEDROCK_MAX_TOKENS: '4096',
    USER_POOL_ID: 'us-west-2_eaUOifAaZ',
    USER_POOL_CLIENT_ID: '2s6v921b0pupo64nn1l69nrsi',
  },
})

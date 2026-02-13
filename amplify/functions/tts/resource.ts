import { defineFunction } from '@aws-amplify/backend'

export const ttsFunction = defineFunction({
  name: 'tts',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  resourceGroupName: 'data',
  environment: {
    USER_POOL_ID: 'us-west-2_eaUOifAaZ',
    USER_POOL_CLIENT_ID: '2s6v921b0pupo64nn1l69nrsi',
  },
})

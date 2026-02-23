import { defineFunction } from '@aws-amplify/backend'

export const ttsFunction = defineFunction({
  name: 'tts',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  resourceGroupName: 'data',
  environment: {},
})

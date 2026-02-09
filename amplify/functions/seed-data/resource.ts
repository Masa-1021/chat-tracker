import { defineFunction } from '@aws-amplify/backend'

export const seedData = defineFunction({
  name: 'seed-data',
  entry: './handler.ts',
  timeoutSeconds: 60,
  environment: {
    INITIAL_ADMIN_EMAIL: 'Sano.Masatoshi@ak.MitsubishiElectric.co.jp',
    INITIAL_ADMIN_USER_ID: 'f8915380-c041-7084-19c7-afd5f4d725de',
  },
})

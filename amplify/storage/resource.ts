import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'chatTrackerStorage',
  access: (allow) => ({
    'public/default/*': [allow.guest.to(['read']), allow.authenticated.to(['read'])],
    'protected/images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
  }),
})

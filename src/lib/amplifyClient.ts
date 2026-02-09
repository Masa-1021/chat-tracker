import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'

export type AmplifyClient = ReturnType<typeof generateClient<Schema>>

let client: AmplifyClient | null = null

export function getAmplifyClient(): AmplifyClient {
  if (!client) {
    client = generateClient<Schema>()
  }
  return client
}

export interface ThemeField {
  id: string
  name: string
  type: string
  required: boolean
  options: string[] | null
  order: number
}

export interface ChatHandlerEvent {
  arguments: {
    sessionId: string
    content: string
    images?: string[]
  }
  identity: {
    sub: string
  }
}

export interface BedrockMessage {
  role: 'user' | 'assistant'
  content: BedrockContentBlock[]
}

export type BedrockContentBlock =
  | { type: 'text'; text: string }
  | {
      type: 'image'
      source: { type: 'base64'; media_type: string; data: string }
    }

export interface StreamChunkRecord {
  id: string
  sessionId: string
  messageId: string
  chunkIndex: number
  content: string
  isComplete: boolean
  timestamp: string
}

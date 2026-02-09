export type { ThemeField, BedrockMessage, BedrockContentBlock } from '../chat-handler/types'

export interface StreamingRequestBody {
  sessionId: string
  content: string
  images?: string[]
}

export interface FunctionUrlEvent {
  requestContext: {
    http: {
      method: string
      path: string
    }
  }
  headers: Record<string, string | undefined>
  body?: string
  isBase64Encoded: boolean
}

export interface NdjsonTextChunk {
  type: 'text'
  content: string
}

export interface NdjsonPingChunk {
  type: 'ping'
}

export interface NdjsonDoneChunk {
  type: 'done'
  messageId: string
  fullContent: string
}

export interface NdjsonErrorChunk {
  type: 'error'
  message: string
}

export type NdjsonChunk = NdjsonTextChunk | NdjsonPingChunk | NdjsonDoneChunk | NdjsonErrorChunk

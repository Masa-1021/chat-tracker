export interface ChatMessageInput {
  content: string
  images?: File[]
}

export interface ChatState {
  currentSessionId: string | null
  isStreaming: boolean
  streamingContent: string
}

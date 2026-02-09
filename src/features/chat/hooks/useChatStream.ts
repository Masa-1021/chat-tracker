import { useState, useCallback, useRef, useEffect } from 'react'
import { getAmplifyClient } from '@/lib/amplifyClient'

interface StreamState {
  isStreaming: boolean
  streamedContent: string
  messageId: string | null
}

interface StreamChunkData {
  sessionId?: string | null
  messageId?: string | null
  chunkIndex?: number | null
  content?: string | null
  isComplete?: boolean | null
}

/**
 * Hook for subscribing to StreamChunk updates via AppSync Subscription.
 * Accumulates streaming chunks and provides the full streamed content.
 */
export function useChatStream(sessionId: string | undefined) {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    streamedContent: '',
    messageId: null,
  })
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const chunksRef = useRef<Map<number, string>>(new Map())

  const startListening = useCallback(() => {
    if (!sessionId) return

    // Reset state
    chunksRef.current.clear()
    setState({ isStreaming: true, streamedContent: '', messageId: null })

    const client = getAmplifyClient()
    const sub = client.models.StreamChunk.onCreate({
      filter: { sessionId: { eq: sessionId } },
    }).subscribe({
      next: (event) => {
        if (!event) return
        const data = event as StreamChunkData

        if (data.isComplete) {
          // Stream complete
          setState((prev) => ({
            ...prev,
            isStreaming: false,
          }))
          return
        }

        const chunkIndex = data.chunkIndex as number
        const content = data.content as string
        const msgId = data.messageId as string

        chunksRef.current.set(chunkIndex, content)

        // Rebuild content from ordered chunks
        const sortedKeys = [...chunksRef.current.keys()].sort(
          (a, b) => a - b,
        )
        const fullContent = sortedKeys
          .map((k) => chunksRef.current.get(k) ?? '')
          .join('')

        setState({
          isStreaming: true,
          streamedContent: fullContent,
          messageId: msgId,
        })
      },
      error: (err: Error) => {
        console.error('Stream subscription error:', err)
        setState((prev) => ({ ...prev, isStreaming: false }))
      },
    })

    subscriptionRef.current = sub
  }, [sessionId])

  const stopListening = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = null
    chunksRef.current.clear()
    setState({ isStreaming: false, streamedContent: '', messageId: null })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe()
    }
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
  }
}

import { useState, useCallback, useRef } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@/types'

const STREAMING_URL = import.meta.env.VITE_STREAMING_CHAT_URL

interface NdjsonTextChunk {
  type: 'text'
  content: string
}

interface NdjsonDoneChunk {
  type: 'done'
  messageId: string
  fullContent: string
}

interface NdjsonErrorChunk {
  type: 'error'
  message: string
}

type NdjsonChunk =
  | NdjsonTextChunk
  | { type: 'ping' }
  | NdjsonDoneChunk
  | NdjsonErrorChunk

interface StreamingState {
  isStreaming: boolean
  streamedContent: string
  error: string | null
}

export function useStreamingChat(sessionId: string | undefined) {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    streamedContent: '',
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)
  const queryClient = useQueryClient()

  const sendStreamingMessage = useCallback(
    async (content: string, images?: string[]) => {
      if (!sessionId || !STREAMING_URL) return

      // Optimistic update: show user message immediately
      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        sessionId,
        role: 'USER',
        content,
        images: images ?? [],
        isStreaming: false,
        timestamp: new Date().toISOString(),
      }

      const queryKey = ['chatMessages', sessionId]
      await queryClient.cancelQueries({ queryKey })
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(queryKey)
      queryClient.setQueryData<ChatMessage[]>(queryKey, (old) => [
        ...(old ?? []),
        optimisticMessage,
      ])

      setState({ isStreaming: true, streamedContent: '', error: null })

      const abortController = new AbortController()
      abortRef.current = abortController

      try {
        const session = await fetchAuthSession()
        const idToken = session.tokens?.idToken?.toString()
        if (!idToken) throw new Error('No ID token available')

        const response = await fetch(STREAMING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ sessionId, content, images }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Parse NDJSON lines
          const lines = buffer.split('\n')
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue

            try {
              const chunk = JSON.parse(trimmed) as NdjsonChunk

              switch (chunk.type) {
                case 'text':
                  accumulated += chunk.content
                  setState((prev) => ({
                    ...prev,
                    streamedContent: accumulated,
                  }))
                  break

                case 'ping':
                  // Keepalive, ignore
                  break

                case 'done':
                  // Refetch messages FIRST so the assistant message appears in the list
                  // before we hide the streaming bubble — prevents a flash of empty content
                  await queryClient.invalidateQueries({
                    queryKey: ['chatMessages', sessionId],
                  })
                  setState({
                    isStreaming: false,
                    streamedContent: '',
                    error: null,
                  })
                  await queryClient.invalidateQueries({
                    queryKey: ['chatSessions'],
                  })
                  return

                case 'error':
                  throw new Error(chunk.message)
              }
            } catch (parseErr) {
              // If it's our own re-thrown error, propagate it
              if (parseErr instanceof Error && parseErr.message !== trimmed) {
                throw parseErr
              }
              console.warn('Failed to parse NDJSON line:', trimmed)
            }
          }
        }

        // If we exit the loop without a 'done' chunk, still clean up
        await queryClient.invalidateQueries({
          queryKey: ['chatMessages', sessionId],
        })
        setState({ isStreaming: false, streamedContent: '', error: null })
        await queryClient.invalidateQueries({
          queryKey: ['chatSessions'],
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setState((prev) => ({ ...prev, isStreaming: false }))
          return
        }

        console.error('Streaming chat error:', err)
        setState({
          isStreaming: false,
          streamedContent: '',
          error: (err as Error).message,
        })

        // Rollback optimistic update on error
        if (previousMessages) {
          queryClient.setQueryData(queryKey, previousMessages)
        }
      } finally {
        abortRef.current = null
      }
    },
    [sessionId, queryClient],
  )

  const cancelStream = useCallback(() => {
    abortRef.current?.abort()
    setState({ isStreaming: false, streamedContent: '', error: null })
  }, [])

  return {
    ...state,
    sendStreamingMessage,
    cancelStream,
  }
}

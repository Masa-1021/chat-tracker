import { useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useChatSession,
  useChatMessages,
  useCreateSession,
} from '../hooks/useChat'
import { useStreamingChat } from '../hooks/useStreamingChat'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ThemeSelector } from './ThemeSelector'
import { ImageAttachment } from './ImageAttachment'
import type { Theme } from '@/types'

export function ChatContainer() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session } = useChatSession(sessionId)
  const { data: messages = [] } = useChatMessages(sessionId)
  const createSession = useCreateSession()

  const {
    isStreaming,
    streamedContent,
    error: streamError,
    sendStreamingMessage,
  } = useStreamingChat(sessionId)

  const [isSending, setIsSending] = useState(false)
  const pendingImagesRef = useRef<string[]>([])

  // When no sessionId: show theme selector
  const handleThemeSelect = useCallback(
    async (theme: Theme) => {
      const newSession = await createSession.mutateAsync({
        themeId: theme.id,
        title: `${theme.name} - 新しいチャット`,
      })
      navigate(`/chat/${newSession.id}`, { replace: true })
    },
    [createSession, navigate],
  )

  const handleImagesChange = useCallback((dataUris: string[]) => {
    pendingImagesRef.current = dataUris
  }, [])

  const handleSend = useCallback(
    async (content: string) => {
      if (!sessionId || isSending || isStreaming) return

      setIsSending(true)

      const images =
        pendingImagesRef.current.length > 0
          ? [...pendingImagesRef.current]
          : undefined
      pendingImagesRef.current = []

      try {
        await sendStreamingMessage(content, images)
      } catch (err) {
        console.error('Send message failed:', err)
      } finally {
        setIsSending(false)
      }
    },
    [sessionId, isSending, isStreaming, sendStreamingMessage],
  )

  // No session yet: show theme selection
  if (!sessionId) {
    return (
      <div className="chat-container chat-container--select">
        <ThemeSelector onSelect={handleThemeSelect} />
      </div>
    )
  }

  return (
    <div className="chat-container">
      {session && (
        <div className="chat-header">
          <h1 className="chat-title">{session.title}</h1>
          <span className="chat-status">
            {session.status === 'ACTIVE'
              ? 'アクティブ'
              : session.status === 'COMPLETED'
                ? '完了'
                : '下書き'}
          </span>
        </div>
      )}
      <MessageList
        messages={messages}
        streamingContent={streamedContent}
        isStreaming={isStreaming}
        isSending={isSending}
      />
      {streamError && (
        <div className="chat-error" role="alert">
          エラー: {streamError}
        </div>
      )}
      <div className="chat-input-area">
        <ImageAttachment
          onImagesChange={handleImagesChange}
          disabled={isSending || isStreaming}
        />
        <MessageInput
          onSend={handleSend}
          disabled={isSending || isStreaming}
          placeholder={
            isSending || isStreaming
              ? 'AI応答を待っています...'
              : 'メッセージを入力...'
          }
        />
      </div>
    </div>
  )
}

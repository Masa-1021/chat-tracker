import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/types'
import { renderMarkdown } from '@/shared/utils/markdown'

interface MessageListProps {
  messages: ChatMessage[]
  streamingContent?: string
  isStreaming?: boolean
}

export function MessageList({
  messages,
  streamingContent,
  isStreaming,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  return (
    <div className="message-list" role="log" aria-label="チャット履歴">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isStreaming && streamingContent && (
        <div className="message-bubble message-assistant">
          <div className="message-role">AI</div>
          <div
            className="message-content"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(streamingContent),
            }}
          />
          <span className="streaming-indicator" aria-label="応答中">
            ●
          </span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'USER'

  return (
    <div
      className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}
    >
      <div className="message-role">{isUser ? 'あなた' : 'AI'}</div>
      <div
        className="message-content"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(message.content),
        }}
      />
      {message.images.length > 0 && (
        <div className="message-images">
          {message.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`添付画像 ${i + 1}`}
              className="message-image-thumb"
              loading="lazy"
            />
          ))}
        </div>
      )}
      <time className="message-time" dateTime={message.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  )
}

import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { Button } from '@serendie/ui'
import { SerendieSymbolSend, SerendieSymbolMic, SerendieSymbolMicMuted } from '@serendie/symbols'
import { useVoiceInput } from '../hooks/useVoiceInput'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'メッセージを入力...',
}: MessageInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTranscript = useCallback((text: string) => {
    setValue((prev) => (prev ? `${prev} ${text}` : text))
    // Auto-resize textarea after adding text
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    })
  }, [])

  const { isListening, isSupported, toggleListening } = useVoiceInput(handleTranscript)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <div className="message-input-container">
      <textarea
        ref={textareaRef}
        className="message-input-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="メッセージ入力"
      />
      {isSupported && (
        <button
          type="button"
          className={`voice-input-btn ${isListening ? 'voice-input-btn--active' : ''}`}
          onClick={toggleListening}
          disabled={disabled}
          aria-label={isListening ? '音声入力を停止' : '音声入力を開始'}
          title={isListening ? '音声入力を停止' : '音声入力'}
        >
          {isListening ? (
            <SerendieSymbolMicMuted width={20} height={20} />
          ) : (
            <SerendieSymbolMic width={20} height={20} />
          )}
        </button>
      )}
      <Button
        styleType="filled"
        size="small"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="送信"
      >
        <SerendieSymbolSend width={18} height={18} />
      </Button>
    </div>
  )
}

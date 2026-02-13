import { useEffect } from 'react'
import { useVoiceDialogue } from '../hooks/useVoiceDialogue'

interface VoiceDialogueOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSend: (content: string) => void
  isStreaming: boolean
  streamedContent: string
  voiceId?: string
}

export function VoiceDialogueOverlay({
  isOpen,
  onClose,
  onSend,
  isStreaming,
  streamedContent,
  voiceId,
}: VoiceDialogueOverlayProps) {
  const { phase, transcript, interimText, aiResponse, start, stop } =
    useVoiceDialogue(onSend, isStreaming, streamedContent, voiceId)

  useEffect(() => {
    if (isOpen) {
      start()
    } else {
      stop()
    }
  }, [isOpen, start, stop])

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stop()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, stop, onClose])

  if (!isOpen) return null

  const handleClose = () => {
    stop()
    onClose()
  }

  const statusLabel =
    phase === 'listening'
      ? 'お話しください...'
      : phase === 'processing'
        ? '考え中...'
        : phase === 'speaking'
          ? ''
          : ''

  return (
    <div className="vd-overlay" role="dialog" aria-label="音声対話モード">
      <button
        className="vd-close"
        onClick={handleClose}
        aria-label="音声対話を終了"
      >
        ✕
      </button>

      <div className="vd-content">
        <div className={`vd-indicator vd-indicator--${phase}`}>
          <div className="vd-circle" />
          <div className="vd-circle vd-circle--outer" />
        </div>

        {statusLabel && <p className="vd-status">{statusLabel}</p>}

        <div className="vd-text">
          {(phase === 'listening' || phase === 'processing') &&
            (transcript || interimText) && (
              <p className="vd-transcript">
                {transcript}
                {interimText && (
                  <span className="vd-transcript-interim">{interimText}</span>
                )}
              </p>
            )}
          {(phase === 'processing' || phase === 'speaking') && aiResponse && (
            <p className="vd-response">{aiResponse}</p>
          )}
        </div>
      </div>

      <p className="vd-hint">Escキーまたは✕ボタンで終了</p>
    </div>
  )
}

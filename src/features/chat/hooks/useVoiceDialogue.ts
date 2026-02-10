import { useState, useCallback, useRef, useEffect } from 'react'

export type VoiceDialoguePhase = 'idle' | 'listening' | 'processing' | 'speaking'

const SILENCE_TIMEOUT_MS = 2000

// ---- SpeechRecognition types ----
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onaudiostart: (() => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- vendor-prefixed API access
  const w = window as unknown as Record<string, SpeechRecognitionConstructor | undefined>
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function isTtsSupported(): boolean {
  return 'speechSynthesis' in window
}

/** Pick the most natural-sounding Japanese voice available */
function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices()
  // Prefer Google's premium voices (most natural)
  return (
    voices.find((v) => v.lang === 'ja-JP' && v.name.includes('Google')) ??
    voices.find((v) => v.lang === 'ja-JP' && !v.localService) ??
    voices.find((v) => v.lang.startsWith('ja')) ??
    null
  )
}

export function useVoiceDialogue(
  sendMessage: (content: string) => void,
  isStreaming: boolean,
  streamedContent: string,
) {
  const [phase, setPhase] = useState<VoiceDialoguePhase>('idle')
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  const phaseRef = useRef<VoiceDialoguePhase>('idle')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transcriptRef = useRef('')
  const interimRef = useRef('')
  const lastContentRef = useRef('')
  const sendMessageRef = useRef(sendMessage)
  sendMessageRef.current = sendMessage

  const isSupported = getSpeechRecognition() !== null && isTtsSupported()

  // Preload voices (Chrome loads them async)
  useEffect(() => {
    if (isTtsSupported()) {
      speechSynthesis.getVoices()
      const handler = () => speechSynthesis.getVoices()
      speechSynthesis.addEventListener('voiceschanged', handler)
      return () => speechSynthesis.removeEventListener('voiceschanged', handler)
    }
  }, [])

  const updatePhase = useCallback((p: VoiceDialoguePhase) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition()
    if (!SR) return

    // Abort previous instance
    const prev = recognitionRef.current
    recognitionRef.current = null
    prev?.abort()
    clearSilenceTimer()

    transcriptRef.current = ''
    interimRef.current = ''
    setTranscript('')
    setInterimText('')

    const recognition = new SR()
    recognition.lang = 'ja-JP'
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (recognitionRef.current !== recognition) return
      clearSilenceTimer()

      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result?.[0]) {
          if (result.isFinal) {
            transcriptRef.current += result[0].transcript
            setTranscript(transcriptRef.current)
          } else {
            interim += result[0].transcript
          }
        }
      }
      interimRef.current = interim
      setInterimText(interim)

      silenceTimerRef.current = setTimeout(() => {
        recognition.stop()
      }, SILENCE_TIMEOUT_MS)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (recognitionRef.current !== recognition) return
      // 'no-speech' and 'aborted' are handled by onend
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Voice dialogue error:', event.error)
        updatePhase('idle')
      }
    }

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return
      clearSilenceTimer()

      if (phaseRef.current !== 'listening') return

      const text = (transcriptRef.current + interimRef.current).trim()
      if (text) {
        updatePhase('processing')
        setAiResponse('')
        lastContentRef.current = ''
        sendMessageRef.current(text)
      } else {
        // No speech detected, restart
        startListening()
      }
    }

    recognition.start()
    updatePhase('listening')
  }, [clearSilenceTimer, updatePhase])

  // Track streamed content for TTS
  useEffect(() => {
    if (streamedContent) {
      lastContentRef.current = streamedContent
      setAiResponse(streamedContent)
    }
  }, [streamedContent])

  // Streaming done → speak the response
  useEffect(() => {
    if (phaseRef.current !== 'processing' || isStreaming || !lastContentRef.current) return

    updatePhase('speaking')

    const utterance = new SpeechSynthesisUtterance(lastContentRef.current)
    utterance.lang = 'ja-JP'
    utterance.rate = 1.35
    utterance.pitch = 1.05
    const voice = pickJapaneseVoice()
    if (voice) utterance.voice = voice

    utterance.onend = () => {
      if (phaseRef.current === 'speaking') {
        startListening()
      }
    }

    utterance.onerror = () => {
      if (phaseRef.current === 'speaking') {
        startListening()
      }
    }

    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }, [isStreaming, updatePhase, startListening])

  const start = useCallback(() => {
    setAiResponse('')
    lastContentRef.current = ''
    startListening()
  }, [startListening])

  const stop = useCallback(() => {
    updatePhase('idle')
    speechSynthesis.cancel()
    const rec = recognitionRef.current
    recognitionRef.current = null
    rec?.abort()
    clearSilenceTimer()
    transcriptRef.current = ''
    interimRef.current = ''
    lastContentRef.current = ''
    setTranscript('')
    setInterimText('')
    setAiResponse('')
  }, [clearSilenceTimer, updatePhase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
      recognitionRef.current?.abort()
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [])

  return { phase, transcript, interimText, aiResponse, isSupported, start, stop }
}

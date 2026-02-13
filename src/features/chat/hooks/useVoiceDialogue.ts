import { useState, useCallback, useRef, useEffect } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

export type VoiceDialoguePhase = 'idle' | 'listening' | 'processing' | 'speaking'

const SILENCE_TIMEOUT_MS = 2000
const TTS_URL = import.meta.env.VITE_TTS_URL

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

async function speakWithPolly(text: string, voiceId = 'Kazuha'): Promise<HTMLAudioElement> {
  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()
  if (!idToken) throw new Error('No ID token')

  const response = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ text, voiceId }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`TTS failed: ${response.status} ${errText}`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)

  // Clean up blob URL after playback
  audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true })
  audio.addEventListener('error', () => URL.revokeObjectURL(url), { once: true })

  return audio
}

export function useVoiceDialogue(
  sendMessage: (content: string) => void,
  isStreaming: boolean,
  streamedContent: string,
  voiceId?: string,
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  sendMessageRef.current = sendMessage

  const isSupported = getSpeechRecognition() !== null && !!TTS_URL

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

  // Streaming done → speak the response with Polly
  useEffect(() => {
    if (phaseRef.current !== 'processing' || isStreaming || !lastContentRef.current) return

    updatePhase('speaking')

    const textToSpeak = lastContentRef.current

    speakWithPolly(textToSpeak, voiceId)
      .then((audio) => {
        if (phaseRef.current !== 'speaking') {
          // Phase changed while fetching audio — discard
          return
        }
        audioRef.current = audio

        audio.addEventListener('ended', () => {
          audioRef.current = null
          if (phaseRef.current === 'speaking') {
            startListening()
          }
        }, { once: true })

        audio.addEventListener('error', () => {
          audioRef.current = null
          console.error('Audio playback error')
          if (phaseRef.current === 'speaking') {
            startListening()
          }
        }, { once: true })

        audio.play().catch((err) => {
          console.error('Audio play failed:', err)
          audioRef.current = null
          if (phaseRef.current === 'speaking') {
            startListening()
          }
        })
      })
      .catch((err) => {
        console.error('Polly TTS error:', err)
        // Fallback: skip speaking and go back to listening
        if (phaseRef.current === 'speaking') {
          startListening()
        }
      })
  }, [isStreaming, updatePhase, startListening, voiceId])

  const start = useCallback(() => {
    setAiResponse('')
    lastContentRef.current = ''
    startListening()
  }, [startListening])

  const stop = useCallback(() => {
    updatePhase('idle')
    // Stop Polly audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
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
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      recognitionRef.current?.abort()
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [])

  return { phase, transcript, interimText, aiResponse, isSupported, start, stop }
}

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
] as const

export function useSessionTimeout(onTimeout: () => void) {
  const { isAuthenticated } = useAuthStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(onTimeout, SESSION_TIMEOUT)
  }, [onTimeout])

  useEffect(() => {
    if (!isAuthenticated) return

    resetTimer()

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true })
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer)
      }
    }
  }, [isAuthenticated, resetTimer])
}

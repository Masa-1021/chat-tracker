import { useState, useEffect, useCallback } from 'react'

/**
 * Hook to monitor online/offline status.
 * Returns isOnline boolean and triggers re-render on network changes.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  const handleOnline = useCallback(() => setIsOnline(true), [])
  const handleOffline = useCallback(() => setIsOnline(false), [])

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  return isOnline
}

import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="offline-indicator" role="alert" aria-live="assertive">
      <span className="offline-indicator-dot" />
      オフラインです。一部の機能が制限されます。
    </div>
  )
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
}

const DATETIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_FORMAT_OPTIONS,
  ...TIME_FORMAT_OPTIONS,
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', DATE_FORMAT_OPTIONS)
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('ja-JP', DATETIME_FORMAT_OPTIONS)
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const diff = now - new Date(dateString).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  if (hours < 24) return `${hours}時間前`
  if (days < 7) return `${days}日前`
  return formatDate(dateString)
}

import type { SavedData, Theme, ThemeField, User } from '@/types'

/**
 * Escape a single CSV field value per RFC 4180:
 * - Wrap in double quotes if the value contains commas, double quotes, or newlines
 * - Escape existing double quotes by doubling them
 */
function escapeCsvField(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? '' : String(value)
  const needsQuoting = str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')
  if (!needsQuoting) return str
  return `"${str.replace(/"/g, '""')}"`
}

/**
 * Collect all unique fields across themes in the data.
 * Uniqueness is by field name (first occurrence wins).
 */
function collectFields(data: SavedData[], themes: Theme[]): ThemeField[] {
  const themeMap = new Map<string, Theme>(themes.map((t) => [t.id, t]))
  const seen = new Set<string>()
  const fields: ThemeField[] = []

  for (const item of data) {
    const theme = themeMap.get(item.themeId)
    if (!theme) continue
    const sorted = [...theme.fields].sort((a, b) => a.order - b.order)
    for (const field of sorted) {
      if (!seen.has(field.name)) {
        seen.add(field.name)
        fields.push(field)
      }
    }
  }

  return fields
}

/**
 * Format an ISO datetime string to a human-readable local format (YYYY/MM/DD HH:mm:ss).
 * Returns the original string if parsing fails.
 */
function formatDatetime(iso: string): string {
  try {
    const d = new Date(iso)
    const pad = (n: number): string => String(n).padStart(2, '0')
    return (
      `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    )
  } catch {
    return iso
  }
}

/**
 * Export SavedData records to a CSV file and trigger a browser download.
 *
 * Columns:
 *   タイトル, テーマ名, [dynamic theme field names...], 作成者, 作成日時, 更新日時
 *
 * - BOM (\uFEFF) is prepended for Excel Japanese compatibility.
 * - All field values are properly escaped per RFC 4180.
 * - For data that spans multiple themes, all field names are unioned in order of first appearance.
 * - 作成者 is displayed as the user's email address (fallback: displayName, then original ID).
 *
 * @param data         - Array of SavedData to export
 * @param themes       - Array of Theme objects (used to resolve field definitions)
 * @param users        - Array of User objects (used to resolve createdBy ID to email)
 * @param filename     - Optional download filename (defaults to "export-YYYY-MM-DD.csv")
 * @param onExported   - Optional callback invoked after the download is triggered (used for audit logging)
 */
export function exportToCsv(
  data: SavedData[],
  themes: Theme[],
  users: User[],
  filename?: string,
  onExported?: () => void,
): void {
  const themeMap = new Map<string, Theme>(themes.map((t) => [t.id, t]))
  const userMap = new Map<string, User>(users.map((u) => [u.id, u]))
  const fields = collectFields(data, themes)

  // Build header row
  const fixedHeaders = ['タイトル', 'テーマ名']
  const fixedTailHeaders = ['作成者', '作成日時', '更新日時']
  const headers = [...fixedHeaders, ...fields.map((f) => f.name), ...fixedTailHeaders]
  const headerRow = headers.map(escapeCsvField).join(',')

  // Build data rows
  const rows = data.map((item) => {
    const theme = themeMap.get(item.themeId)
    const themeName = theme ? theme.name : item.themeId
    const user = userMap.get(item.createdBy)
    const createdByDisplay = user?.email ?? user?.displayName ?? item.createdBy

    const fixedCells = [item.title, themeName]

    const dynamicCells = fields.map((field) => {
      // content は通常 field.id をキーとするが、過去データ互換で name も試す
      const val = item.content[field.id] ?? item.content[field.name]
      return val !== undefined ? val : ''
    })

    const tailCells = [
      createdByDisplay,
      formatDatetime(item.createdAt),
      formatDatetime(item.updatedAt),
    ]

    return [...fixedCells, ...dynamicCells, ...tailCells].map(escapeCsvField).join(',')
  })

  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n')

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const today = new Date().toISOString().slice(0, 10)
  const downloadFilename = filename ?? `export-${today}.csv`

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = downloadFilename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // Revoke the object URL after the download is initiated
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 10000)

  // Invoke audit callback if provided
  onExported?.()
}

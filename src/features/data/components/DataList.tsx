import { useState, useMemo } from 'react'
import { useSavedDataList, useDeleteSavedData } from '../hooks/useData'
import { useThemeList } from '@/features/theme/hooks/useTheme'
import { useUserList } from '@/features/admin/hooks/useAdmin'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { isAdminRole } from '@/shared/utils/permissions'
import { DataCard } from './DataCard'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { exportToCsv } from '../utils/exportCsv'
import type { SavedData } from '@/types'

export function DataList() {
  const [themeFilter, setThemeFilter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const user = useAuthStore((s) => s.user)
  const isAdmin = user ? isAdminRole(user.role) : false

  const filters = themeFilter ? { themeId: themeFilter } : undefined
  const { data: items, isLoading } = useSavedDataList(filters)
  const { data: themes } = useThemeList()
  const { data: users } = useUserList()
  const deleteSavedData = useDeleteSavedData()

  const filtered = useMemo(() => {
    if (!items) return []

    return items.filter((d: SavedData) => {
      // Keyword filter
      if (keyword) {
        const lower = keyword.toLowerCase()
        const matchesTitle = d.title.toLowerCase().includes(lower)
        const matchesMarkdown = d.markdownContent.toLowerCase().includes(lower)
        const matchesContent = Object.values(d.content).some((val) =>
          String(val).toLowerCase().includes(lower),
        )
        if (!matchesTitle && !matchesMarkdown && !matchesContent) return false
      }

      // Date range filter
      if (dateFrom) {
        const createdDate = d.createdAt.slice(0, 10)
        if (createdDate < dateFrom) return false
      }
      if (dateTo) {
        const createdDate = d.createdAt.slice(0, 10)
        if (createdDate > dateTo) return false
      }

      return true
    })
  }, [items, keyword, dateFrom, dateTo])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteSavedData.mutateAsync(deleteTarget)
    setDeleteTarget(null)
  }

  if (isLoading) {
    return <div className="data-loading">データを読み込み中...</div>
  }

  return (
    <div className="data-list-container">
      <div className="page-header">
        <h1>保存データ</h1>
        <button
          type="button"
          className="data-export-btn"
          onClick={() => exportToCsv(filtered, themes ?? [], users ?? [])}
          disabled={filtered.length === 0}
          aria-label="表示中のデータをCSV形式でエクスポート"
        >
          CSVエクスポート
        </button>
      </div>

      <div className="data-filters">
        <input
          type="text"
          className="data-search"
          placeholder="キーワードで検索..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="データ検索"
        />
        <select
          className="data-theme-filter"
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          aria-label="テーマでフィルタ"
        >
          <option value="">すべてのテーマ</option>
          {(themes ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="data-date-range">
          <input
            type="date"
            className="data-date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            aria-label="開始日"
            title="開始日"
          />
          <span className="data-date-separator" aria-hidden="true">〜</span>
          <input
            type="date"
            className="data-date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            aria-label="終了日"
            title="終了日"
          />
        </div>
      </div>

      <p className="data-result-count">
        {filtered.length} 件表示中
      </p>

      <div className="data-grid">
        {filtered.map((d) => (
          <div key={d.id} className="data-grid-item">
            <DataCard data={d} />
            {(isAdmin || d.createdBy === user?.id) && (
              <button
                type="button"
                className="data-delete-btn"
                onClick={() => setDeleteTarget(d.id)}
              >
                削除
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="data-empty">データが見つかりません</p>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="データ削除"
        description="このデータを削除しますか？この操作は取り消せません。他のユーザーも閲覧できなくなります。"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

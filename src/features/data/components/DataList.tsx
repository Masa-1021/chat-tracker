import { useState, useMemo } from 'react'
import { useSavedDataList, useDeleteSavedData } from '../hooks/useData'
import { useThemeList } from '@/features/theme/hooks/useTheme'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { DataCard } from './DataCard'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import type { SavedData } from '@/types'

export function DataList() {
  const [themeFilter, setThemeFilter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'

  const filters = themeFilter ? { themeId: themeFilter } : undefined
  const { data: items, isLoading } = useSavedDataList(filters)
  const { data: themes } = useThemeList()
  const deleteSavedData = useDeleteSavedData()

  const filtered = useMemo(() => {
    if (!items) return []
    if (!keyword) return items
    const lower = keyword.toLowerCase()
    return items.filter(
      (d: SavedData) =>
        d.title.toLowerCase().includes(lower) ||
        d.markdownContent.toLowerCase().includes(lower),
    )
  }, [items, keyword])

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
      </div>

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

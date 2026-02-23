import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router'
import { TextField, Button } from '@serendie/ui'
import { SerendieSymbolPlus } from '@serendie/symbols'
import { ThemeCard } from './ThemeCard'
import { TemplateSelector } from './TemplateSelector'
import { useThemeList, useDeleteTheme } from '../hooks/useTheme'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import type { ThemeTemplate } from '../data/themeTemplates'

export function ThemeList() {
  const { data: themes, isLoading, error } = useThemeList()
  const deleteTheme = useDeleteTheme()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  const filteredThemes = themes?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    await deleteTheme.mutateAsync(deleteTarget)
    setDeleteTarget(null)
  }, [deleteTarget, deleteTheme])

  const handleTemplateSelect = useCallback((template: ThemeTemplate) => {
    setShowTemplateSelector(false)
    navigate(`/themes/new?template=${template.id}`)
  }, [navigate])

  if (isLoading) return <LoadingSpinner />
  if (error) {
    return (
      <div>
        <h1>テーマ管理</h1>
        <p>テーマの読み込みに失敗しました。</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>テーマ管理</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            styleType="outlined"
            size="small"
            type="button"
            onClick={() => setShowTemplateSelector(true)}
          >
            テンプレートから作成
          </Button>
          <Link to="/themes/new">
            <Button styleType="filled" size="small">
              <SerendieSymbolPlus width={16} height={16} />
              新規作成
            </Button>
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 320 }}>
        <TextField
          label="テーマを検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="テーマ名で検索..."
          fullWidth
        />
      </div>

      {filteredThemes && filteredThemes.length > 0 ? (
        <div className="theme-grid">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <p>
          {search
            ? '検索条件に一致するテーマがありません。'
            : 'テーマがまだありません。新規作成してください。'}
        </p>
      )}

      <TemplateSelector
        isOpen={showTemplateSelector}
        onSelect={handleTemplateSelect}
        onClose={() => setShowTemplateSelector(false)}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="テーマを削除"
        message="このテーマを削除しますか？関連するデータは影響を受けません。"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

import { useState } from 'react'
import { SerendieSymbolTag } from '@serendie/symbols'
import { useThemeList } from '@/features/theme/hooks/useTheme'
import { useFavoriteThemes } from '@/features/theme/hooks/useFavoriteTheme'
import type { Theme } from '@/types'

interface ThemeSelectorProps {
  onSelect: (theme: Theme) => void
}

export function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  const [search, setSearch] = useState('')
  const { data: themes, isLoading } = useThemeList()
  const { data: favorites } = useFavoriteThemes()

  const favoriteIds = new Set(favorites?.map((f) => f.themeId) ?? [])

  const filtered = (themes ?? []).filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Sort: favorites first, then by usage count
  const sorted = [...filtered].sort((a, b) => {
    const aFav = favoriteIds.has(a.id) ? 1 : 0
    const bFav = favoriteIds.has(b.id) ? 1 : 0
    if (aFav !== bFav) return bFav - aFav
    return b.usageCount - a.usageCount
  })

  if (isLoading) {
    return <div className="theme-selector-loading">テーマを読み込み中...</div>
  }

  return (
    <div className="theme-selector">
      <h2 className="theme-selector-title">テーマを選択してチャットを開始</h2>
      <input
        type="text"
        className="theme-selector-search"
        placeholder="テーマを検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="テーマ検索"
      />
      <div className="theme-selector-list">
        {sorted.map((theme) => (
          <button
            key={theme.id}
            className={`theme-selector-item ${favoriteIds.has(theme.id) ? 'is-favorite' : ''}`}
            onClick={() => onSelect(theme)}
            type="button"
          >
            <SerendieSymbolTag size={18} />
            <div className="theme-selector-item-info">
              <span className="theme-selector-item-name">{theme.name}</span>
              <span className="theme-selector-item-meta">
                {theme.fields.length}項目
                {favoriteIds.has(theme.id) && ' ★'}
              </span>
            </div>
          </button>
        ))}
        {sorted.length === 0 && (
          <p className="theme-selector-empty">テーマが見つかりません</p>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router'
import { Button } from '@serendie/ui'
import { SerendieSymbolTag } from '@serendie/symbols'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { Theme } from '@/types'
import { formatRelativeTime } from '@/shared/utils/date'

interface ThemeCardProps {
  theme: Theme
  onDelete?: (id: string) => void
}

export function ThemeCard({ theme, onDelete }: ThemeCardProps) {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'

  return (
    <article className="theme-card">
      <div className="theme-card-header">
        <SerendieSymbolTag width={20} height={20} />
        <Link to={`/themes/${theme.id}`} className="theme-card-name">
          {theme.name}
        </Link>
        {theme.isDefault && <span className="theme-card-badge">デフォルト</span>}
      </div>
      <div className="theme-card-meta">
        <span>項目数: {theme.fields.length}</span>
        <span>使用回数: {theme.usageCount}</span>
        <span>{formatRelativeTime(theme.createdAt)}</span>
      </div>
      <div className="theme-card-fields">
        {theme.fields.slice(0, 3).map((field) => (
          <span key={field.id} className="theme-card-field-tag">
            {field.name}
          </span>
        ))}
        {theme.fields.length > 3 && (
          <span className="theme-card-field-tag">
            +{theme.fields.length - 3}
          </span>
        )}
      </div>
      {isAdmin && !theme.isDefault && onDelete && (
        <div className="theme-card-actions">
          <Button
            styleType="ghost"
            size="small"
            onClick={() => onDelete(theme.id)}
          >
            削除
          </Button>
        </div>
      )}
    </article>
  )
}

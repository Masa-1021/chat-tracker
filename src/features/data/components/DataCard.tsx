import { Link } from 'react-router'
import { SerendieSymbolFolder } from '@serendie/symbols'
import { formatRelativeTime } from '@/shared/utils/date'
import type { SavedData } from '@/types'

interface DataCardProps {
  data: SavedData
}

export function DataCard({ data }: DataCardProps) {
  return (
    <article className="data-card">
      <Link to={`/data/${data.id}`} className="data-card-link">
        <div className="data-card-header">
          <SerendieSymbolFolder size={18} />
          <h3 className="data-card-title">{data.title}</h3>
        </div>
        <div className="data-card-meta">
          <span>{formatRelativeTime(data.createdAt)}</span>
          {data.images.length > 0 && (
            <span>{data.images.length}枚の画像</span>
          )}
        </div>
        <p className="data-card-preview">
          {data.markdownContent.slice(0, 120)}
          {data.markdownContent.length > 120 && '...'}
        </p>
      </Link>
    </article>
  )
}

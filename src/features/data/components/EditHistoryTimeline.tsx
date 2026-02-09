import type { EditHistory } from '@/types'
import { formatRelativeTime } from '@/shared/utils/date'

interface EditHistoryTimelineProps {
  history: EditHistory[]
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: '作成',
  UPDATE: '更新',
  DELETE: '削除',
}

export function EditHistoryTimeline({ history }: EditHistoryTimelineProps) {
  if (history.length === 0) {
    return <p className="edit-history-empty">編集履歴がありません</p>
  }

  return (
    <div className="edit-history-timeline" role="list" aria-label="編集履歴">
      {history.map((entry) => (
        <div key={entry.id} className="edit-history-item" role="listitem">
          <div className="edit-history-marker" />
          <div className="edit-history-content">
            <div className="edit-history-header">
              <span
                className={`edit-history-action edit-history-action--${entry.action.toLowerCase()}`}
              >
                {ACTION_LABELS[entry.action] ?? entry.action}
              </span>
              <time dateTime={entry.timestamp}>
                {formatRelativeTime(entry.timestamp)}
              </time>
            </div>
            <div className="edit-history-user">
              ユーザー: {entry.userId}
            </div>
            {entry.action === 'UPDATE' && (
              <details className="edit-history-changes">
                <summary>変更内容を表示</summary>
                <pre>{JSON.stringify(entry.changes, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

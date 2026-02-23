import { useState } from 'react'
import { useAuditLogList } from '../hooks/useAuditLog'
import type { AuditAction } from '@/types'

// Usage example:
// <AuditLogView />

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: 'ログイン',
  LOGOUT: 'ログアウト',
  LOGIN_FAILED: 'ログイン失敗',
  DATA_VIEW: 'データ閲覧',
  DATA_CREATE: 'データ作成',
  DATA_UPDATE: 'データ更新',
  DATA_DELETE: 'データ削除',
  DATA_EXPORT: 'データエクスポート',
  USER_CREATE: 'ユーザー作成',
  USER_UPDATE: 'ユーザー更新',
  USER_DEACTIVATE: 'ユーザー無効化',
  THEME_CREATE: 'テーマ作成',
  THEME_UPDATE: 'テーマ更新',
  THEME_DELETE: 'テーマ削除',
  ADMIN_ACCESS: '管理画面アクセス',
}

const ACTION_BADGE_MODIFIER: Record<AuditAction, string> = {
  LOGIN: 'positive',
  LOGOUT: 'neutral',
  LOGIN_FAILED: 'negative',
  DATA_VIEW: 'neutral',
  DATA_CREATE: 'positive',
  DATA_UPDATE: 'notice',
  DATA_DELETE: 'negative',
  DATA_EXPORT: 'notice',
  USER_CREATE: 'positive',
  USER_UPDATE: 'notice',
  USER_DEACTIVATE: 'negative',
  THEME_CREATE: 'positive',
  THEME_UPDATE: 'notice',
  THEME_DELETE: 'negative',
  ADMIN_ACCESS: 'primary',
}

const ALL_ACTIONS = Object.keys(ACTION_LABELS) as AuditAction[]

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    const pad = (n: number): string => String(n).padStart(2, '0')
    return (
      `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}`
    )
  } catch {
    return iso
  }
}

export function AuditLogView() {
  const [selectedAction, setSelectedAction] = useState<AuditAction | ''>('')

  const { data: logs, isLoading, isError, error } = useAuditLogList(
    selectedAction ? { action: selectedAction } : undefined,
  )

  return (
    <div className="audit-log-container">
      <div className="page-header">
        <h1>監査ログ</h1>
      </div>

      <div className="audit-log-filters">
        <label htmlFor="audit-action-filter" className="audit-log-filter-label">
          アクション
        </label>
        <select
          id="audit-action-filter"
          className="audit-log-filter-select"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value as AuditAction | '')}
        >
          <option value="">すべて</option>
          {ALL_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {ACTION_LABELS[action]}
            </option>
          ))}
        </select>

        {logs && (
          <span className="audit-log-count">
            {logs.length} 件
          </span>
        )}
      </div>

      {isLoading && (
        <p className="admin-loading" role="status">読み込み中...</p>
      )}

      {isError && (
        <p className="auth-error" role="alert">
          エラーが発生しました: {error instanceof Error ? error.message : '不明なエラー'}
        </p>
      )}

      {!isLoading && !isError && logs && (
        <div className="audit-log-table-wrapper">
          <table
            className="audit-log-table admin-table"
            aria-label="監査ログ一覧"
          >
            <thead>
              <tr>
                <th scope="col">日時</th>
                <th scope="col">ユーザー</th>
                <th scope="col">アクション</th>
                <th scope="col">リソース</th>
                <th scope="col">詳細</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="audit-log-empty">
                    ログがありません
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="audit-log-cell--timestamp">
                      <time dateTime={log.timestamp}>
                        {formatTimestamp(log.timestamp)}
                      </time>
                    </td>
                    <td className="audit-log-cell--user">
                      <span className="audit-log-user-email">{log.userEmail}</span>
                    </td>
                    <td>
                      <span
                        className={`audit-action-badge audit-action-badge--${ACTION_BADGE_MODIFIER[log.action] ?? 'neutral'}`}
                      >
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="audit-log-cell--resource">
                      <span className="audit-log-resource-type">{log.resourceType}</span>
                      {log.resourceId && (
                        <span className="audit-log-resource-id">{log.resourceId}</span>
                      )}
                    </td>
                    <td className="audit-log-cell--detail">
                      {log.metadata ? (
                        <details className="audit-log-metadata">
                          <summary>詳細</summary>
                          <pre className="audit-log-metadata-pre">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="audit-log-no-detail">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

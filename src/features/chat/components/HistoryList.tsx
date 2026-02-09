import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@serendie/ui'
import { SerendieSymbolChatRectangle } from '@serendie/symbols'
import { useChatSessions, useDeleteSession } from '../hooks/useChat'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { formatRelativeTime } from '@/shared/utils/date'
import type { ChatSession } from '@/types'

export function HistoryList() {
  const { data: sessions, isLoading } = useChatSessions()
  const deleteSession = useDeleteSession()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = (sessions ?? []).filter(
    (s: ChatSession) =>
      s.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteSession.mutateAsync(deleteTarget)
    setDeleteTarget(null)
  }

  if (isLoading) {
    return <div className="history-loading">履歴を読み込み中...</div>
  }

  return (
    <div className="history-container">
      <div className="page-header">
        <h1>チャット履歴</h1>
      </div>

      <input
        type="text"
        className="history-search"
        placeholder="チャットを検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="チャット検索"
      />

      <div className="history-list">
        {filtered.map((session) => (
          <div key={session.id} className="history-item">
            <Link to={`/chat/${session.id}`} className="history-item-link">
              <SerendieSymbolChatRectangle width={18} height={18} />
              <div className="history-item-info">
                <span className="history-item-title">{session.title}</span>
                <span className="history-item-meta">
                  {session.messageCount}メッセージ ·{' '}
                  {formatRelativeTime(session.updatedAt)}
                </span>
              </div>
            </Link>
            <Button
              styleType="ghost"
              size="small"
              onClick={() => setDeleteTarget(session.id)}
              aria-label={`${session.title}を削除`}
            >
              削除
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="history-empty">チャット履歴がありません</p>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="チャット削除"
        description="このチャット履歴を削除しますか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

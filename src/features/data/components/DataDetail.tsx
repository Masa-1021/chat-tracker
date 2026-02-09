import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from '@serendie/ui'
import {
  useSavedDataById,
  useDeleteSavedData,
  useEditHistory,
} from '../hooks/useData'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { renderMarkdown } from '@/shared/utils/markdown'
import { formatRelativeTime } from '@/shared/utils/date'
import { EditHistoryTimeline } from './EditHistoryTimeline'

export function DataDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useSavedDataById(id)
  const { data: history } = useEditHistory(id)
  const deleteSavedData = useDeleteSavedData()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const canDelete =
    user?.role === 'ADMIN' || data?.createdBy === user?.id

  const handleDelete = async () => {
    if (!id) return
    await deleteSavedData.mutateAsync(id)
    navigate('/data', { replace: true })
  }

  if (isLoading) {
    return <div className="data-loading">読み込み中...</div>
  }

  if (!data) {
    return <div className="data-not-found">データが見つかりません</div>
  }

  return (
    <div className="data-detail">
      <div className="page-header">
        <h1>{data.title}</h1>
        <div className="data-detail-actions">
          <Button
            styleType="outlined"
            size="small"
            onClick={() => setShowHistory((v) => !v)}
          >
            {showHistory ? '詳細に戻る' : '編集履歴'}
          </Button>
          <Button
            styleType="outlined"
            size="small"
            onClick={() => navigate(`/data/${id}/edit`)}
          >
            編集
          </Button>
          {canDelete && (
            <Button
              styleType="ghost"
              size="small"
              onClick={() => setShowDeleteConfirm(true)}
            >
              削除
            </Button>
          )}
        </div>
      </div>

      <div className="data-detail-meta">
        <span>作成: {formatRelativeTime(data.createdAt)}</span>
        <span>更新: {formatRelativeTime(data.updatedAt)}</span>
        {data.images.length > 0 && (
          <span>{data.images.length}枚の画像</span>
        )}
      </div>

      {showHistory ? (
        <EditHistoryTimeline history={history ?? []} />
      ) : (
        <>
          <div
            className="data-detail-content"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(data.markdownContent),
            }}
          />
          {data.images.length > 0 && (
            <div className="data-detail-images">
              {data.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`添付画像 ${i + 1}`}
                  className="data-detail-image"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        title="データ削除"
        description="このデータを削除しますか？この操作は取り消せません。他のユーザーも閲覧できなくなります。"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

import { useState } from 'react'
import { Button } from '@serendie/ui'
import {
  useThemeList,
  useUpdateTheme,
  useDeleteTheme,
} from '@/features/theme/hooks/useTheme'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { formatRelativeTime } from '@/shared/utils/date'

export function ThemeManager() {
  const { data: themes, isLoading } = useThemeList()
  const updateTheme = useUpdateTheme()
  const deleteTheme = useDeleteTheme()

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const handleSetDefault = async (themeId: string) => {
    // Remove default from all, set on target
    for (const theme of themes ?? []) {
      if (theme.isDefault && theme.id !== themeId) {
        await updateTheme.mutateAsync({
          id: theme.id,
          name: theme.name,
          fields: theme.fields,
          isDefault: false,
        })
      }
    }
    const target = themes?.find((t) => t.id === themeId)
    if (target) {
      await updateTheme.mutateAsync({
        id: target.id,
        name: target.name,
        fields: target.fields,
        isDefault: true,
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteTheme.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (isLoading) {
    return <div className="admin-loading">テーマを読み込み中...</div>
  }

  return (
    <div className="admin-theme-manager">
      <div className="page-header">
        <h1>テーマ管理</h1>
      </div>

      <table className="admin-table" role="table">
        <thead>
          <tr>
            <th>テーマ名</th>
            <th>項目数</th>
            <th>使用回数</th>
            <th>デフォルト</th>
            <th>作成日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {(themes ?? []).map((theme) => (
            <tr key={theme.id}>
              <td>{theme.name}</td>
              <td>{theme.fields.length}</td>
              <td>{theme.usageCount}</td>
              <td>
                {theme.isDefault ? (
                  <span className="admin-role-badge admin-role-badge--admin">
                    デフォルト
                  </span>
                ) : (
                  <Button
                    styleType="ghost"
                    size="small"
                    onClick={() => handleSetDefault(theme.id)}
                  >
                    デフォルトに設定
                  </Button>
                )}
              </td>
              <td>{formatRelativeTime(theme.createdAt)}</td>
              <td>
                {!theme.isDefault && (
                  <Button
                    styleType="ghost"
                    size="small"
                    onClick={() =>
                      setDeleteTarget({ id: theme.id, name: theme.name })
                    }
                  >
                    削除
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="テーマ削除"
        description={
          deleteTarget
            ? `「${deleteTarget.name}」を削除しますか？このテーマに関連するデータは保持されますが、新規チャットでは使用できなくなります。`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

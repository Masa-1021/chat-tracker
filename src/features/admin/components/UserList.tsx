import { useState } from 'react'
import { Button } from '@serendie/ui'
import { useUserList, useUpdateUserRole } from '../hooks/useAdmin'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { formatRelativeTime } from '@/shared/utils/date'
import type { UserRole } from '@/types'

export function UserList() {
  const currentUser = useAuthStore((s) => s.user)
  const { data: users, isLoading } = useUserList()
  const updateRole = useUpdateUserRole()

  const [roleChange, setRoleChange] = useState<{
    userId: string
    displayName: string
    newRole: UserRole
  } | null>(null)

  const handleRoleToggle = (
    userId: string,
    displayName: string,
    currentRole: UserRole,
  ) => {
    const newRole: UserRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    setRoleChange({ userId, displayName, newRole })
  }

  const handleConfirmRoleChange = async () => {
    if (!roleChange) return
    await updateRole.mutateAsync({
      userId: roleChange.userId,
      role: roleChange.newRole,
    })
    setRoleChange(null)
  }

  if (isLoading) {
    return <div className="admin-loading">ユーザーを読み込み中...</div>
  }

  return (
    <div className="admin-user-list">
      <div className="page-header">
        <h1>ユーザー管理</h1>
      </div>

      <table className="admin-table" role="table">
        <thead>
          <tr>
            <th>表示名</th>
            <th>メール</th>
            <th>ロール</th>
            <th>登録日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {(users ?? []).map((user) => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className={`admin-role-badge admin-role-badge--${user.role.toLowerCase()}`}
                >
                  {user.role}
                </span>
              </td>
              <td>{formatRelativeTime(user.createdAt)}</td>
              <td>
                {user.id !== currentUser?.id && (
                  <Button
                    styleType="outlined"
                    size="small"
                    onClick={() =>
                      handleRoleToggle(user.id, user.displayName, user.role)
                    }
                  >
                    {user.role === 'ADMIN' ? 'Memberに変更' : 'Adminに変更'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={roleChange !== null}
        title="ロール変更"
        description={
          roleChange
            ? `${roleChange.displayName} のロールを ${roleChange.newRole} に変更しますか？`
            : ''
        }
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setRoleChange(null)}
      />
    </div>
  )
}

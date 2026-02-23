import type { ReactNode } from 'react'
import { usePermission } from '@/shared/hooks/usePermission'
import type { Permission } from '@/types'

interface PermissionGateProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renders `children` only when the authenticated user has the specified permission.
 * Renders `fallback` (defaults to null) when the permission is not granted.
 *
 * Usage:
 *   <PermissionGate permission="data:delete">
 *     <DeleteButton />
 *   </PermissionGate>
 *
 *   <PermissionGate permission="admin:access" fallback={<p>Access denied</p>}>
 *     <AdminPanel />
 *   </PermissionGate>
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const allowed = usePermission(permission)
  return allowed ? <>{children}</> : <>{fallback}</>
}

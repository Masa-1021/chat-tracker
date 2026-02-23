import { useAuthStore } from '@/features/auth/stores/authStore'
import { hasPermission, isAdminRole } from '@/shared/utils/permissions'
import type { Permission } from '@/types'

/**
 * Returns true when the currently authenticated user has the specified permission.
 * Returns false when no user is authenticated.
 */
export function usePermission(permission: Permission): boolean {
  const user = useAuthStore((s) => s.user)
  if (!user) return false
  return hasPermission(user.role, permission)
}

/**
 * Returns true when the currently authenticated user holds an admin role
 * (SUPER_ADMIN, ORG_ADMIN, or legacy ADMIN).
 * Returns false when no user is authenticated.
 */
export function useIsAdmin(): boolean {
  const user = useAuthStore((s) => s.user)
  if (!user) return false
  return isAdminRole(user.role)
}

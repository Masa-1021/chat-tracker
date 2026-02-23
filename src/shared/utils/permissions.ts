import type { UserRole, Permission } from '@/types'

// Mapping of roles to their granted permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'chat:create',
    'chat:view_own',
    'chat:view_team',
    'chat:view_all',
    'data:create',
    'data:edit_own',
    'data:edit_team',
    'data:edit_all',
    'data:delete',
    'data:export',
    'theme:create',
    'theme:edit',
    'theme:delete',
    'user:manage',
    'user:manage_org',
    'admin:access',
    'admin:audit_log',
    'org:manage',
  ],
  ORG_ADMIN: [
    'chat:create',
    'chat:view_own',
    'chat:view_team',
    'chat:view_all',
    'data:create',
    'data:edit_own',
    'data:edit_team',
    'data:edit_all',
    'data:delete',
    'data:export',
    'theme:create',
    'theme:edit',
    'theme:delete',
    'user:manage',
    'user:manage_org',
    'admin:access',
    'admin:audit_log',
  ],
  MANAGER: [
    'chat:create',
    'chat:view_own',
    'chat:view_team',
    'data:create',
    'data:edit_own',
    'data:edit_team',
    'data:export',
    'theme:create',
    'theme:edit',
    'admin:access',
  ],
  OPERATOR: [
    'chat:create',
    'chat:view_own',
    'data:create',
    'data:edit_own',
    'data:export',
  ],
  VIEWER: [
    'chat:view_own',
    'data:export',
  ],
  // Legacy role mappings for backward compatibility
  ADMIN: [
    'chat:create',
    'chat:view_own',
    'chat:view_team',
    'chat:view_all',
    'data:create',
    'data:edit_own',
    'data:edit_team',
    'data:edit_all',
    'data:delete',
    'data:export',
    'theme:create',
    'theme:edit',
    'theme:delete',
    'user:manage',
    'user:manage_org',
    'admin:access',
    'admin:audit_log',
  ],
  MEMBER: [
    'chat:create',
    'chat:view_own',
    'data:create',
    'data:edit_own',
    'data:export',
  ],
}

/**
 * Returns true when the given role has the specified permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

/**
 * Returns true for roles that are considered administrative
 * (SUPER_ADMIN, ORG_ADMIN, and legacy ADMIN).
 */
export function isAdminRole(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ORG_ADMIN' || role === 'ADMIN'
}

/**
 * Returns true when the given role can manage users in any capacity.
 */
export function canManageUsers(role: UserRole): boolean {
  return (
    hasPermission(role, 'user:manage') ||
    hasPermission(role, 'user:manage_org')
  )
}

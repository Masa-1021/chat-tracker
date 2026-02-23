// ========== Organization ==========

export type OrganizationPlan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'

export interface Organization {
  id: string
  name: string
  plan: OrganizationPlan
  maxUsers: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ========== User ==========

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'MANAGER'
  | 'OPERATOR'
  | 'VIEWER'
  // Legacy roles (backward compatible)
  | 'ADMIN'
  | 'MEMBER'

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
  organizationId?: string
  language: string
  displayTheme: string
  createdAt: string
  updatedAt: string
}

// ========== Theme ==========

export type FieldType = 'TEXT' | 'TEXTAREA' | 'DATE' | 'DATETIME' | 'NUMBER' | 'SELECT'

export interface ThemeField {
  id: string
  name: string
  type: FieldType
  required: boolean
  options: string[] | null
  order: number
}

export type PollyVoiceId = 'Kazuha' | 'Tomoko' | 'Mizuki' | 'Takumi'

export interface Theme {
  id: string
  name: string
  fields: ThemeField[]
  voiceId: PollyVoiceId
  createdBy: string
  usageCount: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface FavoriteTheme {
  id: string
  userId: string
  themeId: string
  createdAt: string
}

// ========== Chat ==========

export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'DRAFT'
export type MessageRole = 'USER' | 'ASSISTANT'

export interface ChatSession {
  id: string
  userId: string
  themeId: string
  title: string
  titleLocked: boolean
  status: SessionStatus
  messageCount: number
  createdAt: string
  updatedAt: string
  theme?: Theme
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  images: string[]
  isStreaming: boolean
  timestamp: string
}

export interface StreamChunk {
  id: string
  sessionId: string
  messageId: string
  chunkIndex: number
  content: string
  isComplete: boolean
  timestamp: string
}

// ========== Saved Data ==========

export type EditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface SavedData {
  id: string
  themeId: string
  sessionId?: string
  title: string
  content: Record<string, string | number>
  markdownContent: string
  images: string[]
  createdBy: string
  isDeleted: boolean
  deletedAt?: string
  deletedBy?: string
  createdAt: string
  updatedAt: string
  theme?: Theme
}

export interface EditHistory {
  id: string
  dataId: string
  userId: string
  action: EditAction
  changes: Record<string, unknown>
  snapshot: Record<string, unknown>
  timestamp: string
}

// ========== Audit Log ==========

export type AuditAction =
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  | 'DATA_VIEW' | 'DATA_CREATE' | 'DATA_UPDATE' | 'DATA_DELETE' | 'DATA_EXPORT'
  | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DEACTIVATE'
  | 'THEME_CREATE' | 'THEME_UPDATE' | 'THEME_DELETE'
  | 'ADMIN_ACCESS'

export type AuditResourceType = 'ChatSession' | 'SavedData' | 'Theme' | 'User' | 'Auth' | 'Organization'

export interface AuditLog {
  id: string
  organizationId?: string
  userId: string
  userEmail: string
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  metadata?: Record<string, string>
  timestamp: string
}

// ========== Filters ==========

export interface DataFilters {
  themeId?: string
  createdBy?: string
  keyword?: string
  dateFrom?: string
  dateTo?: string
  sortBy: 'createdAt' | 'updatedAt' | 'title'
  sortOrder: 'ASC' | 'DESC'
  limit: number
  nextToken?: string
}

// ========== Permissions ==========

export type Permission =
  | 'chat:create' | 'chat:view_own' | 'chat:view_team' | 'chat:view_all'
  | 'data:create' | 'data:edit_own' | 'data:edit_team' | 'data:edit_all' | 'data:delete' | 'data:export'
  | 'theme:create' | 'theme:edit' | 'theme:delete'
  | 'user:manage' | 'user:manage_org'
  | 'admin:access' | 'admin:audit_log'
  | 'org:manage'

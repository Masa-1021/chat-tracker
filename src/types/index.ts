// ========== User ==========

export type UserRole = 'ADMIN' | 'MEMBER'

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
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

export interface Theme {
  id: string
  name: string
  fields: ThemeField[]
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

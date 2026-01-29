export interface User {
  id: string
  email: string
  displayName: string
  voiceInputSilenceTimeout: number
  language: string
  displayTheme: string
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Theme {
  id: string
  name: string
  fields: ThemeField[]
  notificationEnabled: boolean
  createdBy: string
  usageCount: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ThemeField {
  id: string
  name: string
  type: FieldType
  required: boolean
  options: string[] | null
  order: number
}

export type FieldType = 'TEXT' | 'TEXTAREA' | 'DATE' | 'DATETIME' | 'NUMBER' | 'SELECT'

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

export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'DRAFT'

export interface ChatMessage {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  images: string[]
  isStreaming: boolean
  timestamp: string
}

export type MessageRole = 'USER' | 'ASSISTANT'

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

export type EditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedDataId?: string
  relatedTeamId?: string
  isRead: boolean
  createdAt: string
}

export type NotificationType = 'NEW_DATA' | 'DATA_UPDATED' | 'TEAM_INVITE'

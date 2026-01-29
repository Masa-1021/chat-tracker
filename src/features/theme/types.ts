export interface ThemeFormData {
  name: string
  fields: ThemeFieldInput[]
  notificationEnabled: boolean
}

export interface ThemeFieldInput {
  id: string
  name: string
  type: FieldType
  required: boolean
  options: string[]
  order: number
}

export type FieldType = 'TEXT' | 'TEXTAREA' | 'DATE' | 'DATETIME' | 'NUMBER' | 'SELECT'

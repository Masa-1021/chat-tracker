import { z } from 'zod'

export const themeFieldSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, '項目名は必須です').max(50, '50文字以内で入力してください'),
  type: z.enum(['TEXT', 'TEXTAREA', 'DATE', 'DATETIME', 'NUMBER', 'SELECT']),
  required: z.boolean(),
  options: z.array(z.string().max(100)).max(20).nullable(),
  order: z.number().int().min(0).max(100),
})

export const createThemeSchema = z.object({
  name: z.string().min(1, 'テーマ名は必須です').max(100, '100文字以内で入力してください'),
  fields: z
    .array(themeFieldSchema)
    .min(1, '少なくとも1つの項目が必要です')
    .max(20, '項目は20個までです'),
})

export type ThemeFormData = z.infer<typeof createThemeSchema>

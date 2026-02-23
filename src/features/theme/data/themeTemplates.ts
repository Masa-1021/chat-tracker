import type { ThemeField } from '@/types'

export interface ThemeTemplate {
  id: string
  name: string
  description: string
  industry: string
  icon: string
  fields: ThemeField[]
}

const KY_FIELDS: ThemeField[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567001',
    name: '作業日',
    type: 'DATE',
    required: true,
    options: null,
    order: 1,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567002',
    name: '作業場所',
    type: 'TEXT',
    required: true,
    options: null,
    order: 2,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567003',
    name: '作業内容',
    type: 'TEXTAREA',
    required: true,
    options: null,
    order: 3,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567004',
    name: '危険予知項目',
    type: 'TEXTAREA',
    required: true,
    options: null,
    order: 4,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567005',
    name: '対策',
    type: 'TEXTAREA',
    required: true,
    options: null,
    order: 5,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567006',
    name: '参加者数',
    type: 'NUMBER',
    required: true,
    options: null,
    order: 6,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567007',
    name: '天候',
    type: 'SELECT',
    required: true,
    options: ['晴れ', '曇り', '雨', '雪', '強風'],
    order: 7,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567008',
    name: 'リーダー名',
    type: 'TEXT',
    required: true,
    options: null,
    order: 8,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567009',
    name: '特記事項',
    type: 'TEXTAREA',
    required: false,
    options: null,
    order: 9,
  },
]

const HACCP_FIELDS: ThemeField[] = [
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678001',
    name: '点検日時',
    type: 'DATETIME',
    required: true,
    options: null,
    order: 1,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678002',
    name: '工程名',
    type: 'SELECT',
    required: true,
    options: ['受入', '下処理', '加工', '加熱', '冷却', '包装', '保管', '出荷'],
    order: 2,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678003',
    name: 'CCP管理点',
    type: 'TEXT',
    required: true,
    options: null,
    order: 3,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678004',
    name: '管理基準',
    type: 'TEXT',
    required: true,
    options: null,
    order: 4,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678005',
    name: '測定値',
    type: 'TEXT',
    required: true,
    options: null,
    order: 5,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678006',
    name: '判定',
    type: 'SELECT',
    required: true,
    options: ['適合', '逸脱', '要観察'],
    order: 6,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678007',
    name: '逸脱時の対応',
    type: 'TEXTAREA',
    required: false,
    options: null,
    order: 7,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678008',
    name: '担当者名',
    type: 'TEXT',
    required: true,
    options: null,
    order: 8,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678009',
    name: '確認者名',
    type: 'TEXT',
    required: false,
    options: null,
    order: 9,
  },
]

const TROUBLE_FIELDS: ThemeField[] = [
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789001',
    name: '発生日時',
    type: 'DATETIME',
    required: true,
    options: null,
    order: 1,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789002',
    name: '設備名',
    type: 'TEXT',
    required: true,
    options: null,
    order: 2,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789003',
    name: '設備番号',
    type: 'TEXT',
    required: false,
    options: null,
    order: 3,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789004',
    name: '故障分類',
    type: 'SELECT',
    required: true,
    options: ['機械故障', '電気故障', '計装故障', 'ユーティリティ', 'その他'],
    order: 4,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789005',
    name: '重要度',
    type: 'SELECT',
    required: true,
    options: ['緊急', '重要', '通常', '軽微'],
    order: 5,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789006',
    name: '症状・状況',
    type: 'TEXTAREA',
    required: true,
    options: null,
    order: 6,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789007',
    name: '原因（推定）',
    type: 'TEXTAREA',
    required: false,
    options: null,
    order: 7,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789008',
    name: '対処内容',
    type: 'TEXTAREA',
    required: true,
    options: null,
    order: 8,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789009',
    name: '復旧状況',
    type: 'SELECT',
    required: true,
    options: ['復旧済み', '仮復旧', '未復旧', '部品待ち'],
    order: 9,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789010',
    name: '停止時間（分）',
    type: 'NUMBER',
    required: false,
    options: null,
    order: 10,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789011',
    name: '報告者名',
    type: 'TEXT',
    required: true,
    options: null,
    order: 11,
  },
]

export const THEME_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'template-construction-ky',
    name: '建設業 KY活動報告',
    description: '現場での危険予知（KY）活動を記録するためのテンプレートです。作業前の安全確認と対策を体系的に管理します。',
    industry: '建設業',
    icon: '🏗️',
    fields: KY_FIELDS,
  },
  {
    id: 'template-food-haccp',
    name: '食品製造 HACCP点検記録',
    description: 'HACCPに基づく食品安全管理の点検記録テンプレートです。各工程のCCP管理点の測定値と判定を記録します。',
    industry: '食品製造業',
    icon: '🍱',
    fields: HACCP_FIELDS,
  },
  {
    id: 'template-equipment-trouble',
    name: '設備故障・トラブル報告',
    description: '設備の故障やトラブル発生時の報告テンプレートです。発生状況・原因・対処内容・復旧状況を一元管理します。',
    industry: '製造業・設備管理',
    icon: '🔧',
    fields: TROUBLE_FIELDS,
  },
]

export function findTemplateById(id: string): ThemeTemplate | undefined {
  return THEME_TEMPLATES.find((t) => t.id === id)
}

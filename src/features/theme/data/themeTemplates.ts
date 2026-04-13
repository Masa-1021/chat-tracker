import type { ComponentType, SVGProps } from 'react'
import {
  SerendieSymbolStickyNote,
  SerendieSymbolArticle,
  SerendieSymbolChatRectangle,
  SerendieSymbolLightning,
  SerendieSymbolCheckSquare,
  SerendieSymbolTool,
  SerendieSymbolAlertCircle,
  SerendieSymbolAlertTriangle,
} from '@serendie/symbols'
import type { ThemeField } from '@/types'

type SerendieIcon = ComponentType<SVGProps<SVGSVGElement>>

export interface ThemeTemplate {
  id: string
  name: string
  description: string
  industry: string
  icon: SerendieIcon
  fields: ThemeField[]
}

// ============================================================
// 汎用テンプレート
// ============================================================

const MEMO_FIELDS: ThemeField[] = [
  { id: 'tpl-memo-01', name: 'タイトル', type: 'TEXT', required: true, options: null, order: 1 },
  { id: 'tpl-memo-02', name: '内容', type: 'TEXTAREA', required: true, options: null, order: 2 },
  { id: 'tpl-memo-03', name: 'タグ', type: 'TEXT', required: false, options: null, order: 3 },
]

const DAILY_REPORT_FIELDS: ThemeField[] = [
  { id: 'tpl-daily-01', name: '日付', type: 'DATE', required: true, options: null, order: 1 },
  { id: 'tpl-daily-02', name: 'やったこと', type: 'TEXTAREA', required: true, options: null, order: 2 },
  { id: 'tpl-daily-03', name: '課題・気づき', type: 'TEXTAREA', required: false, options: null, order: 3 },
  { id: 'tpl-daily-04', name: '明日の予定', type: 'TEXTAREA', required: false, options: null, order: 4 },
]

const MINUTES_FIELDS: ThemeField[] = [
  { id: 'tpl-minutes-01', name: '日時', type: 'DATETIME', required: true, options: null, order: 1 },
  { id: 'tpl-minutes-02', name: '参加者', type: 'TEXT', required: true, options: null, order: 2 },
  { id: 'tpl-minutes-03', name: '議題', type: 'TEXTAREA', required: true, options: null, order: 3 },
  { id: 'tpl-minutes-04', name: '決定事項', type: 'TEXTAREA', required: true, options: null, order: 4 },
  { id: 'tpl-minutes-05', name: '次アクション', type: 'TEXTAREA', required: false, options: null, order: 5 },
]

const IDEA_FIELDS: ThemeField[] = [
  { id: 'tpl-idea-01', name: 'タイトル', type: 'TEXT', required: true, options: null, order: 1 },
  { id: 'tpl-idea-02', name: '内容', type: 'TEXTAREA', required: true, options: null, order: 2 },
  { id: 'tpl-idea-03', name: 'カテゴリ', type: 'TEXT', required: false, options: null, order: 3 },
  {
    id: 'tpl-idea-04',
    name: '優先度',
    type: 'SELECT',
    required: false,
    options: ['高', '中', '低'],
    order: 4,
  },
]

const TASK_FIELDS: ThemeField[] = [
  { id: 'tpl-task-01', name: 'タイトル', type: 'TEXT', required: true, options: null, order: 1 },
  { id: 'tpl-task-02', name: '期限', type: 'DATE', required: false, options: null, order: 2 },
  {
    id: 'tpl-task-03',
    name: '優先度',
    type: 'SELECT',
    required: false,
    options: ['高', '中', '低'],
    order: 3,
  },
  {
    id: 'tpl-task-04',
    name: 'ステータス',
    type: 'SELECT',
    required: true,
    options: ['未着手', '進行中', '完了'],
    order: 4,
  },
]

// ============================================================
// 製造業テンプレート
// ============================================================

const TROUBLE_FIELDS: ThemeField[] = [
  { id: 'tpl-trouble-01', name: '発生日時', type: 'DATETIME', required: true, options: null, order: 1 },
  { id: 'tpl-trouble-02', name: '設備名', type: 'TEXT', required: true, options: null, order: 2 },
  { id: 'tpl-trouble-03', name: '症状・状況', type: 'TEXTAREA', required: true, options: null, order: 3 },
  { id: 'tpl-trouble-04', name: '対処内容', type: 'TEXTAREA', required: true, options: null, order: 4 },
  {
    id: 'tpl-trouble-05',
    name: '復旧状況',
    type: 'SELECT',
    required: true,
    options: ['復旧完了', '仮復旧', '未復旧'],
    order: 5,
  },
  { id: 'tpl-trouble-06', name: '報告者名', type: 'TEXT', required: true, options: null, order: 6 },
]

const QUALITY_FIELDS: ThemeField[] = [
  { id: 'tpl-quality-01', name: '発生日', type: 'DATE', required: true, options: null, order: 1 },
  { id: 'tpl-quality-02', name: '製品名・品番', type: 'TEXT', required: true, options: null, order: 2 },
  { id: 'tpl-quality-03', name: '不良内容', type: 'TEXTAREA', required: true, options: null, order: 3 },
  { id: 'tpl-quality-04', name: '推定原因', type: 'TEXTAREA', required: true, options: null, order: 4 },
  { id: 'tpl-quality-05', name: '対策', type: 'TEXTAREA', required: true, options: null, order: 5 },
  { id: 'tpl-quality-06', name: '報告者名', type: 'TEXT', required: true, options: null, order: 6 },
]

const NEAR_MISS_FIELDS: ThemeField[] = [
  { id: 'tpl-near-01', name: '発生日時', type: 'DATETIME', required: true, options: null, order: 1 },
  { id: 'tpl-near-02', name: '場所', type: 'TEXT', required: true, options: null, order: 2 },
  { id: 'tpl-near-03', name: '発生状況', type: 'TEXTAREA', required: true, options: null, order: 3 },
  { id: 'tpl-near-04', name: '原因', type: 'TEXTAREA', required: true, options: null, order: 4 },
  { id: 'tpl-near-05', name: '再発防止策', type: 'TEXTAREA', required: true, options: null, order: 5 },
  { id: 'tpl-near-06', name: '報告者名', type: 'TEXT', required: true, options: null, order: 6 },
]

// ============================================================
// テンプレート一覧
// ============================================================

export const THEME_TEMPLATES: ThemeTemplate[] = [
  // 汎用
  {
    id: 'template-memo',
    name: 'メモ',
    description: 'アイデアや情報をシンプルに記録するテンプレート。タイトル・内容・タグの3項目のみ。',
    industry: '汎用',
    icon: SerendieSymbolStickyNote,
    fields: MEMO_FIELDS,
  },
  {
    id: 'template-daily-report',
    name: '日報',
    description: '日々の業務を記録するテンプレート。やったこと・課題・明日の予定を簡潔に。',
    industry: '汎用',
    icon: SerendieSymbolArticle,
    fields: DAILY_REPORT_FIELDS,
  },
  {
    id: 'template-minutes',
    name: '議事録',
    description: '会議の記録用テンプレート。参加者・議題・決定事項・次アクションを管理。',
    industry: '汎用',
    icon: SerendieSymbolChatRectangle,
    fields: MINUTES_FIELDS,
  },
  {
    id: 'template-idea',
    name: 'アイデア',
    description: '思いついたアイデアを整理するテンプレート。カテゴリと優先度で分類可能。',
    industry: '汎用',
    icon: SerendieSymbolLightning,
    fields: IDEA_FIELDS,
  },
  {
    id: 'template-task',
    name: 'タスク',
    description: 'タスク管理用テンプレート。期限・優先度・ステータスで進捗を把握。',
    industry: '汎用',
    icon: SerendieSymbolCheckSquare,
    fields: TASK_FIELDS,
  },
  // 製造業
  {
    id: 'template-equipment-trouble',
    name: '設備故障・トラブル報告',
    description: '設備の故障やトラブル発生時の報告テンプレート。発生状況・対処・復旧状況を管理。',
    industry: '製造業',
    icon: SerendieSymbolTool,
    fields: TROUBLE_FIELDS,
  },
  {
    id: 'template-quality-defect',
    name: '品質不良・不適合報告',
    description: '製品の不良・不適合を記録するテンプレート。原因分析と対策まで管理。',
    industry: '製造業',
    icon: SerendieSymbolAlertCircle,
    fields: QUALITY_FIELDS,
  },
  {
    id: 'template-near-miss',
    name: 'ヒヤリハット報告',
    description: 'ヒヤリハット・危険予知事例の報告テンプレート。再発防止策の記録で安全文化を醸成。',
    industry: '製造業',
    icon: SerendieSymbolAlertTriangle,
    fields: NEAR_MISS_FIELDS,
  },
]

export function findTemplateById(id: string): ThemeTemplate | undefined {
  return THEME_TEMPLATES.find((t) => t.id === id)
}

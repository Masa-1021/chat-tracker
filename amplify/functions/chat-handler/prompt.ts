import type { ThemeField } from './types'

const FIELD_TYPE_DESCRIPTIONS: Record<string, string> = {
  TEXT: 'テキスト（短い文章）',
  TEXTAREA: 'テキスト（長い文章）',
  DATE: '日付（YYYY-MM-DD）',
  DATETIME: '日時（YYYY-MM-DD HH:mm）',
  NUMBER: '数値',
  SELECT: '選択肢から選択',
}

function getFieldTypeDescription(type: string): string {
  return FIELD_TYPE_DESCRIPTIONS[type] ?? type
}

export function buildSystemPrompt(
  themeName: string,
  fields: ThemeField[],
  existingData: Record<string, string | null>,
): string {
  const fieldDescriptions = fields
    .sort((a, b) => a.order - b.order)
    .map((f) => {
      const typeDesc = getFieldTypeDescription(f.type)
      const requiredLabel = f.required ? '【必須】' : '【任意】'
      const optionsDesc =
        f.options && f.options.length > 0
          ? ` (選択肢: ${f.options.join(', ')})`
          : ''
      return `- ${f.name} ${requiredLabel}: ${typeDesc}${optionsDesc}`
    })
    .join('\n')

  const collectedDescriptions = Object.entries(existingData)
    .map(([key, value]) => `- ${key}: ${value ?? '未入力'}`)
    .join('\n')

  const confirmFields = fields
    .map((f) => `【${f.name}】: {収集した値}`)
    .join('\n')

  const now = new Date()
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const currentDatetime = jstNow.toISOString().replace('T', ' ').slice(0, 16)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday = weekdays[jstNow.getUTCDay()]

  return `あなたは製造現場の情報収集を支援するAIアシスタントです。
ユーザーとの対話を通じて、必要な情報を収集し、構造化されたデータとして保存する手助けをします。

## 現在日時: ${currentDatetime}（${weekday}曜日）JST

## 現在のテーマ: ${themeName}

## 収集する情報項目:
${fieldDescriptions}

## 現在収集済みの情報:
${collectedDescriptions || '（まだ情報が収集されていません）'}

## あなたの役割:
1. ユーザーが提供する情報を自然な対話で収集してください
2. 必須項目が不足している場合は、適切な質問で情報を引き出してください
3. 情報が曖昧な場合は、具体的に確認してください
4. 全ての必須項目が揃ったら、保存前の確認を行ってください

## 応答のガイドライン:
- 簡潔で分かりやすい日本語を使用
- 製造現場の専門用語を理解し適切に対応
- ユーザーの入力を尊重しつつ、必要な情報を漏れなく収集
- 確認時は箇条書きで情報を整理して表示
- 「昨日」「今朝」「先週」「さっき」などの相対的な時間表現は、現在日時から自動的に具体的な日時に変換して記録する（ユーザーに再確認しない）

## 保存確認のフォーマット:
全ての必須情報が揃った場合、以下のフォーマットで確認:
"""
以下の内容で保存してよろしいですか？

${confirmFields}

「はい」と答えていただければ保存します。修正が必要な場合はお知らせください。
"""

## 重要な制約:
- 収集した情報は正確に記録し、勝手に改変しない
- ユーザーが明示的に訂正した場合のみ情報を更新
- 不明な点は推測せず、必ず確認を取る`
}

interface TitleMessage {
  role: string
  content: string
}

export function buildTitleGenerationPrompt(
  messages: TitleMessage[],
): string {
  const chatContent = messages
    .slice(0, 5)
    .map(
      (m) =>
        `${m.role === 'USER' ? 'ユーザー' : 'AI'}: ${m.content.slice(0, 200)}`,
    )
    .join('\n')

  return `以下のチャット内容から、簡潔な見出しを生成してください。

## フォーマット
YYYY/MM/DD [内容の要約（15文字以内）]

## チャット内容:
${chatContent}

## 出力
見出しのみを1行で出力してください。説明は不要です。`
}

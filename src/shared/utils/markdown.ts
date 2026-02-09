import type { ThemeField } from '@/types'

export function generateMarkdown(
  title: string,
  fields: ThemeField[],
  data: Record<string, string | number>
): string {
  const lines: string[] = [`# ${title}`, '']

  const sortedFields = [...fields].sort((a, b) => a.order - b.order)
  for (const field of sortedFields) {
    const value = data[field.id]
    if (value !== undefined && value !== '') {
      lines.push(`## ${field.name}`)
      lines.push('')
      lines.push(String(value))
      lines.push('')
    }
  }

  return lines.join('\n')
}

export function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_{}[\]()#+\-.!|]/g, '\\$&')
}

/**
 * Lightweight markdown-to-HTML renderer for chat messages.
 * Supports: paragraphs, bold, italic, inline code, code blocks, lists, headings.
 */
export function renderMarkdown(text: string): string {
  let html = escapeHtml(text)

  // Code blocks (``` ... ```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre><code>$2</code></pre>',
  )

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Headings (## only in chat context)
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  // Paragraphs: split by double newlines
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

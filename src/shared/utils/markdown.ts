/**
 * 簡易的なMarkdownレンダリング関数
 * 保存データのMarkdownコンテンツをHTMLに変換
 */
export function renderMarkdown(markdown: string): string {
  let html = markdown

  // 見出し
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')

  // 太字
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')

  // イタリック
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

  // リスト
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc mb-4">$1</ul>')

  // 段落
  html = html.replace(/^(?!<[h|u|l]|$)(.+)$/gm, '<p class="mb-2">$1</p>')

  // 改行
  html = html.replace(/\n/g, '<br />')

  return html
}

/**
 * データをMarkdown形式に変換
 */
export function dataToMarkdown(
  title: string,
  content: Record<string, string | number>
): string {
  let markdown = `# ${title}\n\n`

  for (const [key, value] of Object.entries(content)) {
    markdown += `## ${key}\n\n${value}\n\n`
  }

  return markdown.trim()
}

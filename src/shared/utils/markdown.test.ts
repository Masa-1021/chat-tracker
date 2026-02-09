import { describe, it, expect } from 'vitest'
import { generateMarkdown, escapeMarkdown, renderMarkdown } from './markdown'
import type { ThemeField } from '@/types'

describe('markdown utilities', () => {
  describe('generateMarkdown', () => {
    const fields: ThemeField[] = [
      { id: 'f1', name: '発生日時', type: 'DATETIME', required: true, options: null, order: 0 },
      { id: 'f2', name: 'トラブル内容', type: 'TEXTAREA', required: true, options: null, order: 1 },
      { id: 'f3', name: '原因', type: 'TEXTAREA', required: false, options: null, order: 2 },
    ]

    it('generates markdown with title and filled fields', () => {
      const data = {
        f1: '2025-06-15 10:30',
        f2: 'ライン停止',
      }
      const result = generateMarkdown('テスト報告', fields, data)
      expect(result).toContain('# テスト報告')
      expect(result).toContain('## 発生日時')
      expect(result).toContain('2025-06-15 10:30')
      expect(result).toContain('## トラブル内容')
      expect(result).toContain('ライン停止')
    })

    it('skips empty fields', () => {
      const data = { f1: '2025-06-15', f2: '', f3: '' }
      const result = generateMarkdown('テスト', fields, data)
      expect(result).toContain('## 発生日時')
      expect(result).not.toContain('## トラブル内容')
      expect(result).not.toContain('## 原因')
    })

    it('orders fields by order property', () => {
      const data = { f1: 'val1', f2: 'val2', f3: 'val3' }
      const result = generateMarkdown('テスト', fields, data)
      const idx1 = result.indexOf('発生日時')
      const idx2 = result.indexOf('トラブル内容')
      const idx3 = result.indexOf('原因')
      expect(idx1).toBeLessThan(idx2)
      expect(idx2).toBeLessThan(idx3)
    })
  })

  describe('escapeMarkdown', () => {
    it('escapes special markdown characters', () => {
      expect(escapeMarkdown('**bold**')).toBe('\\*\\*bold\\*\\*')
      expect(escapeMarkdown('# heading')).toBe('\\# heading')
    })

    it('leaves plain text unchanged', () => {
      expect(escapeMarkdown('plain text')).toBe('plain text')
    })
  })

  describe('renderMarkdown', () => {
    it('converts bold text', () => {
      const result = renderMarkdown('**太字**テスト')
      expect(result).toContain('<strong>太字</strong>')
    })

    it('converts italic text', () => {
      const result = renderMarkdown('*斜体*テスト')
      expect(result).toContain('<em>斜体</em>')
    })

    it('converts inline code', () => {
      const result = renderMarkdown('Use `console.log` here')
      expect(result).toContain('<code>console.log</code>')
    })

    it('converts headings', () => {
      expect(renderMarkdown('# H1')).toContain('<h2>H1</h2>')
      expect(renderMarkdown('## H2')).toContain('<h3>H2</h3>')
      expect(renderMarkdown('### H3')).toContain('<h4>H3</h4>')
    })

    it('converts unordered lists', () => {
      const result = renderMarkdown('- item 1\n- item 2')
      expect(result).toContain('<li>item 1</li>')
      expect(result).toContain('<li>item 2</li>')
      expect(result).toContain('<ul>')
    })

    it('escapes HTML special characters', () => {
      const result = renderMarkdown('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('wraps plain text in paragraphs', () => {
      const result = renderMarkdown('Hello\n\nWorld')
      expect(result).toContain('<p>Hello</p>')
      expect(result).toContain('<p>World</p>')
    })
  })
})

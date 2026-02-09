import { describe, it, expect } from 'vitest'
import { validateImageFile, validateImageCount, validateRequired } from './validation'

describe('validation utilities', () => {
  describe('validateImageFile', () => {
    it('returns null for valid JPEG file', () => {
      const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
      expect(validateImageFile(file)).toBeNull()
    })

    it('returns null for valid PNG file', () => {
      const file = new File(['data'], 'image.png', { type: 'image/png' })
      expect(validateImageFile(file)).toBeNull()
    })

    it('returns error for unsupported file type', () => {
      const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' })
      const result = validateImageFile(file)
      expect(result).toContain('対応していない画像形式です')
    })

    it('returns error for oversized file', () => {
      // Create a file > 10MB
      const bigData = new Uint8Array(11 * 1024 * 1024)
      const file = new File([bigData], 'big.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result).toContain('ファイルサイズが大きすぎます')
    })

    it('accepts WebP format', () => {
      const file = new File(['data'], 'img.webp', { type: 'image/webp' })
      expect(validateImageFile(file)).toBeNull()
    })

    it('accepts GIF format', () => {
      const file = new File(['data'], 'img.gif', { type: 'image/gif' })
      expect(validateImageFile(file)).toBeNull()
    })

    it('accepts BMP format', () => {
      const file = new File(['data'], 'img.bmp', { type: 'image/bmp' })
      expect(validateImageFile(file)).toBeNull()
    })
  })

  describe('validateImageCount', () => {
    it('returns null when within limit', () => {
      expect(validateImageCount(2, 2)).toBeNull()
    })

    it('returns null at exact limit', () => {
      expect(validateImageCount(3, 2)).toBeNull()
    })

    it('returns error when exceeding limit', () => {
      const result = validateImageCount(4, 2)
      expect(result).toContain('画像は最大5枚まで')
    })
  })

  describe('validateRequired', () => {
    it('returns null for non-empty string', () => {
      expect(validateRequired('hello', 'テスト')).toBeNull()
    })

    it('returns error for empty string', () => {
      const result = validateRequired('', 'タイトル')
      expect(result).toBe('タイトルは必須です')
    })

    it('returns error for whitespace-only string', () => {
      const result = validateRequired('   ', 'テーマ名')
      expect(result).toBe('テーマ名は必須です')
    })
  })
})

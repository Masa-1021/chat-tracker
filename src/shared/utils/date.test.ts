import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, formatDateTime, formatRelativeTime } from './date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('formats ISO date string to ja-JP date', () => {
      const result = formatDate('2025-06-15T10:30:00.000Z')
      // ja-JP format: YYYY/MM/DD
      expect(result).toMatch(/2025/)
      expect(result).toMatch(/06/)
      expect(result).toMatch(/15/)
    })
  })

  describe('formatDateTime', () => {
    it('formats ISO date string to ja-JP datetime', () => {
      const result = formatDateTime('2025-06-15T10:30:00.000Z')
      expect(result).toMatch(/2025/)
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "たった今" for times less than 60 seconds ago', () => {
      const result = formatRelativeTime('2025-06-15T11:59:30.000Z')
      expect(result).toBe('たった今')
    })

    it('returns minutes for times less than 60 minutes ago', () => {
      const result = formatRelativeTime('2025-06-15T11:45:00.000Z')
      expect(result).toBe('15分前')
    })

    it('returns hours for times less than 24 hours ago', () => {
      const result = formatRelativeTime('2025-06-15T09:00:00.000Z')
      expect(result).toBe('3時間前')
    })

    it('returns days for times less than 7 days ago', () => {
      const result = formatRelativeTime('2025-06-13T12:00:00.000Z')
      expect(result).toBe('2日前')
    })

    it('returns formatted date for times more than 7 days ago', () => {
      const result = formatRelativeTime('2025-06-01T12:00:00.000Z')
      expect(result).toMatch(/2025/)
      expect(result).toMatch(/06/)
      expect(result).toMatch(/01/)
    })
  })
})

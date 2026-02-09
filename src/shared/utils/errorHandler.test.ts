import { describe, it, expect, vi } from 'vitest'
import { parseAppError, handleAppError } from './errorHandler'

vi.mock('./errorReporter', () => ({
  captureError: vi.fn(),
}))

describe('parseAppError', () => {
  it('parses network fetch errors', () => {
    const error = new TypeError('Failed to fetch')
    const result = parseAppError(error)
    expect(result.code).toBe('NET_FETCH_FAILED')
    expect(result.retryable).toBe(true)
  })

  it('parses unauthorized errors', () => {
    const error = new Error('Unauthorized')
    const result = parseAppError(error)
    expect(result.code).toBe('AUTH_UNAUTHORIZED')
    expect(result.retryable).toBe(false)
  })

  it('parses forbidden errors', () => {
    const error = new Error('403 Forbidden')
    const result = parseAppError(error)
    expect(result.code).toBe('AUTHZ_FORBIDDEN')
    expect(result.retryable).toBe(false)
  })

  it('parses Amplify GraphQL errors', () => {
    const error = Object.assign(new Error('GraphQL error'), {
      errors: [{ errorType: 'Lambda execution failed', message: 'AI failure' }],
    })
    const result = parseAppError(error)
    expect(result.code).toBe('AI_INVOKE_FAILED')
    expect(result.retryable).toBe(true)
  })

  it('returns SYS_UNKNOWN for unknown errors', () => {
    const result = parseAppError('string error')
    expect(result.code).toBe('SYS_UNKNOWN')
    expect(result.retryable).toBe(false)
  })
})

describe('handleAppError', () => {
  it('flags redirect for auth errors', () => {
    const error = new Error('Unauthorized')
    const result = handleAppError(error, 'test')
    expect(result.shouldRedirectToLogin).toBe(true)
    expect(result.shouldShowOffline).toBe(false)
  })

  it('flags offline for network errors', () => {
    const error = new TypeError('Failed to fetch')
    const result = handleAppError(error, 'test')
    expect(result.shouldShowOffline).toBe(true)
    expect(result.shouldRedirectToLogin).toBe(false)
  })

  it('reports SYS errors to Sentry', async () => {
    const { captureError } = await import('./errorReporter')
    const error = new Error('Something broke')
    handleAppError(error, 'test-component')
    expect(captureError).toHaveBeenCalledWith(error, {
      source: 'test-component',
      level: 'error',
    })
  })
})

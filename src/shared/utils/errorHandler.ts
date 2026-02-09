/**
 * Centralized error handler for AppSync / Amplify errors.
 *
 * Categorizes errors and takes appropriate action:
 * - AUTH_*     → redirect to login
 * - AUTHZ_*   → show permission denied
 * - VAL_*     → return for form display
 * - AI_*      → retry or fallback message
 * - NET_*     → offline mode
 * - OFFLINE_* → offline indicator
 * - SYS_*     → error page + report to Sentry
 */

import { captureError } from './errorReporter'

interface AppError {
  code: string
  message: string
  retryable: boolean
}

type ErrorCategory = 'AUTH' | 'AUTHZ' | 'VAL' | 'AI' | 'NET' | 'OFFLINE' | 'SYS'

const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  AUTH: '認証エラーが発生しました。再ログインしてください。',
  AUTHZ: '権限がありません。管理者に連絡してください。',
  VAL: '入力内容に問題があります。',
  AI: 'AI処理中にエラーが発生しました。',
  NET: 'ネットワークに接続できません。',
  OFFLINE: 'オフラインモードで動作しています。',
  SYS: 'システムエラーが発生しました。',
}

export function parseAppError(error: unknown): AppError {
  if (error instanceof Error) {
    const amplifyError = error as Error & {
      errors?: Array<{ errorType?: string; message?: string }>
    }
    if (amplifyError.errors?.length) {
      const first = amplifyError.errors[0]
      const code = mapErrorType(first.errorType)
      return {
        code,
        message: first.message ?? ERROR_MESSAGES[getCategory(code)],
        retryable: code.startsWith('AI_') || code.startsWith('NET_'),
      }
    }

    // Network / fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { code: 'NET_FETCH_FAILED', message: ERROR_MESSAGES.NET, retryable: true }
    }

    // Unauthorized
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return { code: 'AUTH_UNAUTHORIZED', message: ERROR_MESSAGES.AUTH, retryable: false }
    }

    // Forbidden
    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return { code: 'AUTHZ_FORBIDDEN', message: ERROR_MESSAGES.AUTHZ, retryable: false }
    }
  }

  return {
    code: 'SYS_UNKNOWN',
    message: ERROR_MESSAGES.SYS,
    retryable: false,
  }
}

function mapErrorType(errorType?: string): string {
  if (!errorType) return 'SYS_UNKNOWN'

  if (errorType.includes('Unauthorized') || errorType.includes('Unauthenticated')) {
    return 'AUTH_UNAUTHORIZED'
  }
  if (errorType.includes('Forbidden') || errorType.includes('AccessDenied')) {
    return 'AUTHZ_FORBIDDEN'
  }
  if (errorType.includes('ValidationError')) {
    return 'VAL_INVALID'
  }
  if (errorType.includes('Lambda') || errorType.includes('Bedrock')) {
    return 'AI_INVOKE_FAILED'
  }
  return 'SYS_UNKNOWN'
}

function getCategory(code: string): ErrorCategory {
  const prefix = code.split('_')[0] as ErrorCategory
  return prefix in ERROR_MESSAGES ? prefix : 'SYS'
}

export interface HandleErrorResult {
  shouldRedirectToLogin: boolean
  shouldShowOffline: boolean
  userMessage: string
  retryable: boolean
}

export function handleAppError(error: unknown, source?: string): HandleErrorResult {
  const appError = parseAppError(error)
  const category = getCategory(appError.code)

  if (category === 'SYS') {
    captureError(error, { source, level: 'error' })
  }

  return {
    shouldRedirectToLogin: category === 'AUTH',
    shouldShowOffline: category === 'NET' || category === 'OFFLINE',
    userMessage: appError.message,
    retryable: appError.retryable,
  }
}

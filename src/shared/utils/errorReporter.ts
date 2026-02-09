/**
 * Error reporting abstraction.
 *
 * In production, this integrates with Sentry.
 * In development, errors are logged to the console.
 *
 * To enable Sentry, set VITE_SENTRY_DSN in environment variables.
 */

interface ErrorContext {
  /** Where the error occurred (e.g. component name, hook name) */
  source?: string
  /** Additional metadata */
  extra?: Record<string, string | number | boolean>
  /** Error severity */
  level?: 'fatal' | 'error' | 'warning' | 'info'
}

type SentryLike = {
  init: (options: Record<string, unknown>) => void
  captureException: (error: unknown, context?: Record<string, unknown>) => void
  captureMessage: (message: string, level?: string) => void
  setUser: (user: { id: string; email?: string } | null) => void
}

let sentryInstance: SentryLike | null = null

export async function initErrorReporter(): Promise<void> {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[ErrorReporter] Sentry DSN not configured – console-only mode')
    }
    return
  }

  try {
    // Module name constructed at runtime to avoid Vite's static import analysis
    // when @sentry/react is not installed (optional dependency)
    const sentryModule = ['@sentry', 'react'].join('/')
    const Sentry = (await import(/* @vite-ignore */ sentryModule)) as unknown as SentryLike
    Sentry.init({
      dsn,
      environment: (import.meta.env.VITE_SENTRY_ENVIRONMENT as string) || 'development',
      enabled: import.meta.env.PROD,
      tracesSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
    sentryInstance = Sentry
  } catch {
    console.warn('[ErrorReporter] Failed to load Sentry – falling back to console')
  }
}

export function captureError(error: unknown, context?: ErrorContext): void {
  const level = context?.level ?? 'error'

  if (sentryInstance) {
    sentryInstance.captureException(error, {
      tags: context?.source ? { source: context.source } : undefined,
      extra: context?.extra,
      level,
    })
  }

  if (import.meta.env.DEV) {
    console.error(`[${level.toUpperCase()}]`, context?.source ?? '', error)
  }
}

export function captureMessage(message: string, level: ErrorContext['level'] = 'info'): void {
  if (sentryInstance) {
    sentryInstance.captureMessage(message, level)
  }

  if (import.meta.env.DEV) {
    console.info(`[${(level ?? 'info').toUpperCase()}]`, message)
  }
}

export function setReporterUser(user: { id: string; email?: string } | null): void {
  if (sentryInstance) {
    sentryInstance.setUser(user)
  }
}

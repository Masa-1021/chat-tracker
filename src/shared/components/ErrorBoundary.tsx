import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Button } from '@serendie/ui'
import { captureError } from '@/shared/utils/errorReporter'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureError(error, {
      source: 'ErrorBoundary',
      extra: { componentStack: errorInfo.componentStack ?? '' },
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              borderRadius: '12px',
              background: 'var(--colors-sd-system-color-component-surface)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--colors-sd-system-color-impression-negative)',
                marginBottom: '16px',
              }}
            >
              エラーが発生しました
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--colors-sd-system-color-component-on-surface-variant)',
                marginBottom: '16px',
              }}
            >
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {this.state.error && (
              <details style={{ fontSize: '12px', marginBottom: '16px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                  詳細を表示
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    padding: '8px',
                    borderRadius: '4px',
                    background: 'var(--colors-sd-system-color-component-surface-container-dim)',
                    overflow: 'auto',
                    fontSize: '11px',
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button
              styleType="filled"
              onClick={() => window.location.reload()}
              style={{ width: '100%' }}
            >
              ページを再読み込み
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

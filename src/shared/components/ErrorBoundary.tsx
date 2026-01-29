import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

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
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-default p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
            <p className="text-sm text-neutral-600 mb-4">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {this.state.error && (
              <details className="text-xs text-neutral-500 mb-4">
                <summary className="cursor-pointer font-medium">詳細を表示</summary>
                <pre className="mt-2 p-2 bg-neutral-50 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

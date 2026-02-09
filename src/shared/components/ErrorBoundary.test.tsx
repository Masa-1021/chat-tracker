import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function ThrowingComponent(): never {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading', { name: /エラーが発生しました/ })).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})

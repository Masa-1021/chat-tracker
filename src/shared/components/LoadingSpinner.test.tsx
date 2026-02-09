import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with screen reader text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })
})

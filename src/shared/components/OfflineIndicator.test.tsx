import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OfflineIndicator } from './OfflineIndicator'

describe('OfflineIndicator', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when online', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })
    const { container } = render(<OfflineIndicator />)
    expect(container.firstChild).toBeNull()
  })

  it('renders alert when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })
    render(<OfflineIndicator />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/オフラインです/)).toBeInTheDocument()
  })
})

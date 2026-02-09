import { ProgressIndicatorIndeterminate } from '@serendie/ui'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label="読み込み中">
      <ProgressIndicatorIndeterminate type="circular" size={size} />
      <span className="sr-only">読み込み中...</span>
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'var(--sd-system-color-surface-default)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <LoadingSpinner size="large" />
        <p style={{ fontSize: '14px', color: 'var(--sd-system-color-label-low-emphasis)' }}>
          読み込み中...
        </p>
      </div>
    </div>
  )
}

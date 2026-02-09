import { ModalDialog } from '@serendie/ui'

interface ConfirmDialogProps {
  /** Whether dialog is open. Accepts both `open` and `isOpen` for convenience. */
  open?: boolean
  isOpen?: boolean
  title: string
  /** Dialog body message. Accepts both `message` and `description`. */
  message?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  isOpen,
  title,
  message,
  description,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDialogOpen = open ?? isOpen ?? false
  const bodyText = message ?? description ?? ''

  return (
    <ModalDialog
      isOpen={isDialogOpen}
      title={title}
      submitButtonLabel={confirmLabel}
      cancelButtonLabel={cancelLabel}
      onButtonClick={onConfirm}
      onOpenChange={(details) => {
        if (!details.open) onCancel()
      }}
    >
      <p style={{ fontSize: '14px' }}>{bodyText}</p>
    </ModalDialog>
  )
}

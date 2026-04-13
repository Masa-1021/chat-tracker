import { useEffect, useRef } from 'react'
import { Button } from '@serendie/ui'
import { THEME_TEMPLATES, type ThemeTemplate } from '../data/themeTemplates'

interface TemplateSelectorProps {
  isOpen: boolean
  onSelect: (template: ThemeTemplate) => void
  onClose: () => void
}

/**
 * Usage:
 * <TemplateSelector
 *   isOpen={showSelector}
 *   onSelect={(template) => navigate(`/themes/new?template=${template.id}`)}
 *   onClose={() => setShowSelector(false)}
 * />
 */
export function TemplateSelector({ isOpen, onSelect, onClose }: TemplateSelectorProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="template-selector-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="テンプレートを選択"
      onClick={handleOverlayClick}
    >
      <div className="template-selector-content" ref={dialogRef}>
        <div className="template-selector-header">
          <h2 className="template-selector-title">業種テンプレートから作成</h2>
          <button
            type="button"
            className="template-selector-close"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <p className="template-selector-description">
          業種に合わせたフィールドが自動で設定されます。作成後に自由にカスタマイズできます。
        </p>

        <div className="template-card-grid">
          {THEME_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className="template-card"
              onClick={() => onSelect(template)}
              aria-label={`${template.name}テンプレートを選択`}
            >
              <div className="template-card-icon" aria-hidden="true">
                <template.icon width={32} height={32} />
              </div>
              <div className="template-card-body">
                <div className="template-card-header">
                  <span className="template-card-name">{template.name}</span>
                  <span className="template-card-industry-tag">{template.industry}</span>
                </div>
                <p className="template-card-description">{template.description}</p>
                <span className="template-card-field-count">
                  フィールド数: {template.fields.length}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="template-selector-footer">
          <Button styleType="outlined" type="button" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useCallback } from 'react'
import { TextField, Button, Select } from '@serendie/ui'
import { SerendieSymbolPlus } from '@serendie/symbols'
import type { ThemeField, FieldType } from '@/types'

const FIELD_TYPE_OPTIONS = [
  { label: 'テキスト', value: 'TEXT' },
  { label: 'テキストエリア', value: 'TEXTAREA' },
  { label: '日付', value: 'DATE' },
  { label: '日時', value: 'DATETIME' },
  { label: '数値', value: 'NUMBER' },
  { label: '選択肢', value: 'SELECT' },
]

interface ThemeFieldEditorProps {
  fields: ThemeField[]
  onChange: (fields: ThemeField[]) => void
  disabled?: boolean
}

export function ThemeFieldEditor({
  fields,
  onChange,
  disabled,
}: ThemeFieldEditorProps) {
  const addField = useCallback(() => {
    const newField: ThemeField = {
      id: `f${Date.now()}`,
      name: '',
      type: 'TEXT',
      required: false,
      options: null,
      order: fields.length,
    }
    onChange([...fields, newField])
  }, [fields, onChange])

  const updateField = useCallback(
    (index: number, updates: Partial<ThemeField>) => {
      const updated = fields.map((f, i) =>
        i === index ? { ...f, ...updates } : f,
      )
      onChange(updated)
    },
    [fields, onChange],
  )

  const removeField = useCallback(
    (index: number) => {
      const updated = fields
        .filter((_, i) => i !== index)
        .map((f, i) => ({ ...f, order: i }))
      onChange(updated)
    },
    [fields, onChange],
  )

  const moveField = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= fields.length) return
      const updated = [...fields]
      const temp = updated[index]
      updated[index] = updated[targetIndex]
      updated[targetIndex] = temp
      onChange(updated.map((f, i) => ({ ...f, order: i })))
    },
    [fields, onChange],
  )

  return (
    <div className="field-editor">
      <div className="field-editor-header">
        <h3>項目設定</h3>
        <Button
          styleType="outlined"
          size="small"
          onClick={addField}
          disabled={disabled || fields.length >= 20}
        >
          <SerendieSymbolPlus width={16} height={16} />
          項目を追加
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="field-editor-empty">
          項目がありません。「項目を追加」ボタンで追加してください。
        </p>
      )}

      <div className="field-editor-list">
        {fields.map((field, index) => (
          <div key={field.id} className="field-editor-item">
            <div className="field-editor-item-header">
              <span className="field-editor-item-number">{index + 1}</span>
              <div className="field-editor-item-controls">
                <button
                  type="button"
                  onClick={() => moveField(index, 'up')}
                  disabled={disabled || index === 0}
                  className="field-editor-move-btn"
                  aria-label="上に移動"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveField(index, 'down')}
                  disabled={disabled || index === fields.length - 1}
                  className="field-editor-move-btn"
                  aria-label="下に移動"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  disabled={disabled}
                  className="field-editor-remove-btn"
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="field-editor-item-body">
              <TextField
                label="項目名"
                value={field.name}
                onChange={(e) =>
                  updateField(index, { name: e.target.value })
                }
                required
                fullWidth
                disabled={disabled}
              />
              <Select
                label="タイプ"
                items={FIELD_TYPE_OPTIONS}
                value={[field.type]}
                onValueChange={(detail) =>
                  updateField(index, {
                    type: detail.value[0] as FieldType,
                    options: detail.value[0] === 'SELECT' ? [] : null,
                  })
                }
                disabled={disabled}
              />
              <label className="field-editor-checkbox">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, { required: e.target.checked })
                  }
                  disabled={disabled}
                />
                必須
              </label>
              {field.type === 'SELECT' && (
                <TextField
                  label="選択肢（カンマ区切り）"
                  value={field.options?.join(', ') ?? ''}
                  onChange={(e) =>
                    updateField(index, {
                      options: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="選択肢1, 選択肢2, 選択肢3"
                  fullWidth
                  disabled={disabled}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

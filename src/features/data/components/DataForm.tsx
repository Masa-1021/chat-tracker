import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button, TextField } from '@serendie/ui'
import { useSavedDataById, useUpdateSavedData } from '../hooks/useData'
import { useThemeList } from '@/features/theme/hooks/useTheme'
import { generateMarkdown } from '@/shared/utils/markdown'
import type { SavedData, Theme, ThemeField } from '@/types'

export function DataForm() {
  const { id } = useParams<{ id: string }>()

  const { data: savedData, isLoading } = useSavedDataById(id)
  const { data: themes } = useThemeList()

  const theme = themes?.find((t) => t.id === savedData?.themeId)

  if (isLoading) {
    return <div className="data-loading">読み込み中...</div>
  }

  if (!savedData) {
    return <div className="data-not-found">データが見つかりません</div>
  }

  // key={savedData.id} forces re-mount when data changes, avoiding useEffect setState
  return (
    <DataFormInner
      key={savedData.id}
      savedData={savedData}
      theme={theme}
    />
  )
}

function DataFormInner({
  savedData,
  theme,
}: {
  savedData: SavedData
  theme: Theme | undefined
}) {
  const navigate = useNavigate()
  const updateSavedData = useUpdateSavedData()

  const [title, setTitle] = useState(savedData.title)
  const [fieldValues, setFieldValues] = useState(savedData.content)
  const [error, setError] = useState<string | null>(null)

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!theme) return
    setError(null)

    try {
      const markdownContent = generateMarkdown(
        title,
        theme.fields,
        fieldValues,
      )
      await updateSavedData.mutateAsync({
        id: savedData.id,
        title,
        content: fieldValues,
        markdownContent,
      })
      navigate(`/data/${savedData.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    }
  }

  return (
    <div className="data-form-container">
      <div className="page-header">
        <h1>データ編集</h1>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="data-form" onSubmit={handleSubmit}>
        <TextField
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {theme && (
          <div className="data-form-fields">
            {theme.fields
              .sort((a: ThemeField, b: ThemeField) => a.order - b.order)
              .map((field: ThemeField) => (
                <div key={field.id} className="data-form-field">
                  {field.type === 'TEXTAREA' ? (
                    <div className="data-form-textarea-wrapper">
                      <label className="data-form-label">
                        {field.name}
                        {field.required && <span className="required"> *</span>}
                      </label>
                      <textarea
                        className="data-form-textarea"
                        value={String(fieldValues[field.id] ?? '')}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.value)
                        }
                        required={field.required}
                        rows={4}
                      />
                    </div>
                  ) : field.type === 'SELECT' && field.options ? (
                    <div className="data-form-select-wrapper">
                      <label className="data-form-label">
                        {field.name}
                        {field.required && <span className="required"> *</span>}
                      </label>
                      <select
                        className="data-form-select"
                        value={String(fieldValues[field.id] ?? '')}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.value)
                        }
                        required={field.required}
                      >
                        <option value="">選択してください</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <TextField
                      label={`${field.name}${field.required ? ' *' : ''}`}
                      type={
                        field.type === 'NUMBER'
                          ? 'number'
                          : field.type === 'DATE'
                            ? 'date'
                            : field.type === 'DATETIME'
                              ? 'datetime-local'
                              : 'text'
                      }
                      value={String(fieldValues[field.id] ?? '')}
                      onChange={(e) =>
                        handleFieldChange(
                          field.id,
                          field.type === 'NUMBER'
                            ? Number(e.target.value)
                            : e.target.value,
                        )
                      }
                      required={field.required}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        <div className="data-form-actions">
          <Button styleType="filled" type="submit">
            保存
          </Button>
          <Button
            styleType="outlined"
            type="button"
            onClick={() => navigate(-1)}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}

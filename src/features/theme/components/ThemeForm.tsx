import { useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { TextField, Button, Select } from '@serendie/ui'
import { ThemeFieldEditor } from './ThemeFieldEditor'
import { useThemeById, useCreateTheme, useUpdateTheme } from '../hooks/useTheme'
import { createThemeSchema } from '../schema'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import type { ThemeField, PollyVoiceId } from '@/types'
import { findTemplateById } from '../data/themeTemplates'

const VOICE_OPTIONS = [
  { label: 'Kazuha（女性・クリアで自然）', value: 'Kazuha' },
  { label: 'Tomoko（女性・落ち着いたトーン）', value: 'Tomoko' },
  { label: 'Takumi（男性・信頼感のある声）', value: 'Takumi' },
  { label: 'Mizuki（女性・スタンダード）', value: 'Mizuki' },
]
import { ROUTES } from '@/shared/constants/config'

function resolveInitialValues(
  templateId: string | null,
  existingTheme: { name: string; fields: ThemeField[]; voiceId: PollyVoiceId } | undefined,
  isEdit: boolean,
): { name: string; fields: ThemeField[]; voiceId: PollyVoiceId } {
  if (isEdit) {
    return {
      name: existingTheme?.name ?? '',
      fields: existingTheme?.fields ?? [],
      voiceId: existingTheme?.voiceId ?? 'Kazuha',
    }
  }

  if (templateId) {
    const template = findTemplateById(templateId)
    if (template) {
      return {
        name: template.name,
        fields: template.fields,
        voiceId: 'Kazuha',
      }
    }
  }

  return { name: '', fields: [], voiceId: 'Kazuha' }
}

export function ThemeForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const templateId = searchParams.get('template')

  const { data: existingTheme, isLoading } = useThemeById(id)
  const createTheme = useCreateTheme()
  const updateTheme = useUpdateTheme()

  const initial = resolveInitialValues(templateId, existingTheme, isEdit)

  const [name, setName] = useState(initial.name)
  const [fields, setFields] = useState<ThemeField[]>(initial.fields)
  const [voiceId, setVoiceId] = useState<PollyVoiceId>(initial.voiceId)
  const [errors, setErrors] = useState<string[]>([])
  const [synced, setSynced] = useState(!isEdit)

  // Sync form when data loads for edit mode
  if (isEdit && existingTheme && !synced) {
    setName(existingTheme.name)
    setFields(existingTheme.fields)
    setVoiceId(existingTheme.voiceId ?? 'Kazuha')
    setSynced(true)
  }

  if (isEdit && isLoading) {
    return <LoadingSpinner />
  }

  const isSaving = createTheme.isPending || updateTheme.isPending

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors([])

    const result = createThemeSchema.safeParse({ name, fields })
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message))
      return
    }

    try {
      if (isEdit && id) {
        await updateTheme.mutateAsync({ id, name, fields, voiceId })
      } else {
        await createTheme.mutateAsync({ name, fields, voiceId })
      }
      navigate(ROUTES.themes, { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setErrors([err.message])
      }
    }
  }

  const appliedTemplate = !isEdit && templateId ? findTemplateById(templateId) : undefined

  return (
    <div>
      <h1>{isEdit ? 'テーマ編集' : 'テーマ作成'}</h1>

      {appliedTemplate && (
        <div className="template-applied-banner">
          <span className="template-applied-icon" aria-hidden="true">
            {appliedTemplate.icon}
          </span>
          <span>
            テンプレート「{appliedTemplate.name}」を適用中。フィールドは自由に編集できます。
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}
      >
        {errors.length > 0 && (
          <div className="auth-error" role="alert">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <TextField
          label="テーマ名"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: トラブルメンテナンス"
          required
          fullWidth
          disabled={isSaving}
        />

        <Select
          label="音声対話の声"
          items={VOICE_OPTIONS}
          value={[voiceId]}
          onValueChange={(detail) => setVoiceId(detail.value[0] as PollyVoiceId)}
          disabled={isSaving}
        />

        <ThemeFieldEditor
          fields={fields}
          onChange={setFields}
          disabled={isSaving}
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            styleType="filled"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : isEdit ? '更新' : '作成'}
          </Button>
          <Button
            styleType="outlined"
            type="button"
            onClick={() => navigate(ROUTES.themes)}
            disabled={isSaving}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}

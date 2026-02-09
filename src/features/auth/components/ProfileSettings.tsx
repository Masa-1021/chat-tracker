import { useState, type FormEvent } from 'react'
import { TextField, Button, Select } from '@serendie/ui'
import { useProfile } from '../hooks/useProfile'

const LANGUAGE_OPTIONS = [
  { label: '日本語', value: 'ja' },
  { label: 'English', value: 'en' },
]

const THEME_OPTIONS = [
  { label: 'システム設定に従う', value: 'system' },
  { label: 'Konjo（紺青）', value: 'konjo' },
  { label: 'Asagi（浅葱）', value: 'asagi' },
  { label: 'Sumire（菫）', value: 'sumire' },
  { label: 'Tsutsuji（躑躅）', value: 'tsutsuji' },
  { label: 'Kurikawa（栗皮）', value: 'kurikawa' },
]

export function ProfileSettings() {
  const { user, isSaving, error, updateProfile } = useProfile()

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [language, setLanguage] = useState(user?.language ?? 'ja')
  const [displayTheme, setDisplayTheme] = useState(
    user?.displayTheme ?? 'system',
  )
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    if (!displayName.trim()) return

    try {
      await updateProfile({ displayName, language, displayTheme })
      setSuccessMessage('プロフィールを更新しました。')
    } catch {
      // error is handled by useProfile
    }
  }

  return (
    <div>
      <h1>プロフィール設定</h1>
      <form
        onSubmit={handleSubmit}
        className="profile-form"
        style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}
      >
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="profile-success" role="status">
            {successMessage}
          </div>
        )}
        <TextField
          label="メールアドレス"
          value={user?.email ?? ''}
          disabled
          fullWidth
        />
        <TextField
          label="表示名"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          fullWidth
          disabled={isSaving}
        />
        <Select
          label="言語"
          name="language"
          items={LANGUAGE_OPTIONS}
          value={[language]}
          onValueChange={(detail) => setLanguage(detail.value[0])}
          disabled={isSaving}
        />
        <Select
          label="表示テーマ"
          name="displayTheme"
          items={THEME_OPTIONS}
          value={[displayTheme]}
          onValueChange={(detail) => setDisplayTheme(detail.value[0])}
          disabled={isSaving}
        />
        <Button
          styleType="filled"
          type="submit"
          disabled={isSaving || !displayName.trim()}
        >
          {isSaving ? '保存中...' : '保存'}
        </Button>
      </form>
    </div>
  )
}

import { useCallback, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import type { User } from '@/types'

interface ProfileUpdate {
  displayName: string
  language: string
  displayTheme: string
}

export function useProfile() {
  const { user, setUser } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!user) return

      setIsSaving(true)
      setError(null)

      try {
        // TODO: Save to DynamoDB via Amplify Data API
        // For now, update local state only
        const updatedUser: User = {
          ...user,
          displayName: updates.displayName,
          language: updates.language,
          displayTheme: updates.displayTheme,
          updatedAt: new Date().toISOString(),
        }

        setUser(updatedUser)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'プロフィールの更新に失敗しました。'
        setError(message)
        throw err
      } finally {
        setIsSaving(false)
      }
    },
    [user, setUser],
  )

  return {
    user,
    isSaving,
    error,
    updateProfile,
  }
}

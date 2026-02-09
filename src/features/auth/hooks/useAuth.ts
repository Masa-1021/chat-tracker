import { useCallback } from 'react'
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth'
import { useAuthStore } from '../stores/authStore'
import type { User } from '@/types'

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, clear } =
    useAuthStore()

  const checkCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      const { userId } = await getCurrentUser()
      const attributes = await fetchUserAttributes()

      // Build User object from Cognito attributes
      // Role will be fetched from DynamoDB User table in production
      const currentUser: User = {
        id: userId,
        email: attributes.email ?? '',
        displayName: attributes.name ?? attributes.email ?? '',
        role: 'MEMBER',
        language: 'ja',
        displayTheme: 'system',
        createdAt: '',
        updatedAt: '',
      }

      setUser(currentUser)
    } catch {
      clear()
    }
  }, [setUser, setLoading, clear])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await amplifySignIn({ username: email, password })
      if (result.nextStep.signInStep === 'DONE') {
        await checkCurrentUser()
      }
      return result
    },
    [checkCurrentUser],
  )

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const result = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: displayName,
          },
        },
      })
      return result
    },
    [],
  )

  const confirmSignUp = useCallback(
    async (email: string, code: string) => {
      await amplifyConfirmSignUp({ username: email, confirmationCode: code })
    },
    [],
  )

  const handleSignOut = useCallback(async () => {
    await amplifySignOut()
    clear()
  }, [clear])

  const resetPassword = useCallback(async (email: string) => {
    const result = await amplifyResetPassword({ username: email })
    return result
  }, [])

  const confirmResetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      await amplifyConfirmResetPassword({
        username: email,
        newPassword,
        confirmationCode: code,
      })
    },
    [],
  )

  const isAdmin = user?.role === 'ADMIN'

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    checkCurrentUser,
    signIn,
    signUp,
    confirmSignUp,
    signOut: handleSignOut,
    resetPassword,
    confirmResetPassword,
  }
}

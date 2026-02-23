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
import { isAdminRole } from '@/shared/utils/permissions'
import { logAuditEvent } from '@/shared/utils/auditLogger'
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
        // Fire-and-forget: log successful login (userId resolved after checkCurrentUser)
        const updatedUser = useAuthStore.getState().user
        if (updatedUser) {
          void logAuditEvent({
            userId: updatedUser.id,
            userEmail: updatedUser.email,
            action: 'LOGIN',
            resourceType: 'Auth',
          })
        }
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

  const isAdmin = user ? isAdminRole(user.role) : false

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

import { useEffect, useCallback } from 'react'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSessionTimeout } from '@/features/auth/hooks/useSessionTimeout'
import { STALE_TIME } from '@/shared/constants/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
    },
  },
})

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkCurrentUser, signOut } = useAuth()

  const handleSessionTimeout = useCallback(async () => {
    await signOut()
    window.location.href = '/login'
  }, [signOut])

  useSessionTimeout(handleSessionTimeout)

  useEffect(() => {
    checkCurrentUser()
  }, [checkCurrentUser])

  return <>{children}</>
}

export function Root() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

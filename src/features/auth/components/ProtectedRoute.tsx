import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { ROUTES } from '@/shared/constants/config'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  return <Outlet />
}

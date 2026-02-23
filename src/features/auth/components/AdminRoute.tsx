import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/authStore'
import { isAdminRole } from '@/shared/utils/permissions'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { ROUTES } from '@/shared/constants/config'

export function AdminRoute() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user || !isAdminRole(user.role)) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}

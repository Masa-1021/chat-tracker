import { Routes, Route, Navigate } from 'react-router'
import { AppLayout } from '@/shared/components/Layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AdminRoute } from '@/features/auth/components/AdminRoute'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { PasswordResetForm } from '@/features/auth/components/PasswordResetForm'
import { ProfileSettings } from '@/features/auth/components/ProfileSettings'
import { ThemeList } from '@/features/theme/components/ThemeList'
import { ThemeForm } from '@/features/theme/components/ThemeForm'
import { ChatContainer } from '@/features/chat/components/ChatContainer'
import { HistoryList } from '@/features/chat/components/HistoryList'
import { DataList } from '@/features/data/components/DataList'
import { DataDetail } from '@/features/data/components/DataDetail'
import { DataForm } from '@/features/data/components/DataForm'
import { AdminDashboard } from '@/features/admin/components/AdminDashboard'
import { UserList } from '@/features/admin/components/UserList'
import { ThemeManager } from '@/features/admin/components/ThemeManager'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (auth pages) */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/password-reset" element={<PasswordResetForm />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ChatContainer />} />
          <Route path="/chat" element={<ChatContainer />} />
          <Route path="/chat/:sessionId" element={<ChatContainer />} />
          <Route path="/history" element={<HistoryList />} />
          <Route path="/data" element={<DataList />} />
          <Route path="/data/:id" element={<DataDetail />} />
          <Route path="/data/:id/edit" element={<DataForm />} />
          <Route path="/themes" element={<ThemeList />} />
          <Route path="/themes/new" element={<ThemeForm />} />
          <Route path="/themes/:id" element={<ThemeForm />} />
          <Route path="/profile" element={<ProfileSettings />} />

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/themes" element={<ThemeManager />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

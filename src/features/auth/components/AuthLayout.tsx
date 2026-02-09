import type { ReactNode } from 'react'
import { SerendieSymbolChatRectangle } from '@serendie/symbols'
import { APP_NAME } from '@/shared/constants/config'

interface AuthLayoutProps {
  children: ReactNode
  title: string
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
          <SerendieSymbolChatRectangle size={32} />
          <span className="auth-brand-name">{APP_NAME}</span>
        </div>
        <h1 className="auth-title">{title}</h1>
        {children}
      </div>
    </div>
  )
}

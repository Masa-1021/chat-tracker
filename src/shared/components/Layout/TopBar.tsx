import { Link } from 'react-router'
import { IconButton } from '@serendie/ui'
import { SerendieSymbolChatRectangle, SerendieSymbolLogout } from '@serendie/symbols'
import { APP_NAME } from '@/shared/constants/config'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function TopBar() {
  const { user, signOut } = useAuth()

  return (
    <header className="top-bar">
      <Link to="/" className="top-bar-brand" aria-label={`${APP_NAME} トップへ`}>
        <SerendieSymbolChatRectangle size={24} />
        <span className="top-bar-brand-name">{APP_NAME}</span>
      </Link>
      <div className="top-bar-actions">
        {user && (
          <span className="top-bar-user-name">{user.displayName}</span>
        )}
        <IconButton
          shape="circle"
          styleType="ghost"
          size="small"
          icon={<SerendieSymbolLogout size={20} />}
          onClick={signOut}
          aria-label="ログアウト"
        />
      </div>
    </header>
  )
}

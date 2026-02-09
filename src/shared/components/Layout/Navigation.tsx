import { NavLink } from 'react-router'
import {
  SerendieSymbolPlus,
  SerendieSymbolHistory,
  SerendieSymbolFolder,
  SerendieSymbolTag,
  SerendieSymbolGear,
  SerendieSymbolGroup,
} from '@serendie/symbols'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { ComponentType, SVGProps } from 'react'

interface NavItem {
  path: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'チャット',
    items: [
      { path: '/chat', label: '新しいチャット', icon: SerendieSymbolPlus },
      { path: '/history', label: 'チャット履歴', icon: SerendieSymbolHistory },
    ],
  },
  {
    label: 'データ',
    items: [
      { path: '/data', label: '保存データ', icon: SerendieSymbolFolder },
      { path: '/themes', label: 'テーマ管理', icon: SerendieSymbolTag },
    ],
  },
]

const ADMIN_GROUP: NavGroup = {
  label: '管理',
  items: [
    { path: '/admin/users', label: 'ユーザー管理', icon: SerendieSymbolGroup },
    { path: '/admin/themes', label: 'テーマ管理', icon: SerendieSymbolTag },
    { path: '/admin', label: 'システム設定', icon: SerendieSymbolGear },
  ],
}

export function Navigation() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'

  const groups = isAdmin ? [...NAV_GROUPS, ADMIN_GROUP] : NAV_GROUPS

  return (
    <nav aria-label="メインナビゲーション">
      {groups.map((group) => (
        <div key={group.label} className="nav-group">
          <span className="nav-group-label">{group.label}</span>
          <ul className="nav-group-list">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/chat'}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link--active' : ''}`
                  }
                  aria-current={undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon width={20} height={20} />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="sr-only">（現在のページ）</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

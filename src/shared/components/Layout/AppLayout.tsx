import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-default">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Chat Tracker
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/chat"
            className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
          >
            チャット
          </Link>
          <Link
            to="/data"
            className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
          >
            データ
          </Link>
          <Link
            to="/themes"
            className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
          >
            テーマ
          </Link>
          <Link
            to="/teams"
            className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
          >
            チーム
          </Link>
        </nav>
        <div>
          <Link
            to="/profile"
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            プロフィール
          </Link>
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'ホーム', icon: '🏠' },
    { path: '/chat', label: 'チャット', icon: '💬' },
    { path: '/data', label: 'データ', icon: '📊' },
    { path: '/themes', label: 'テーマ', icon: '🎨' },
    { path: '/teams', label: 'チーム', icon: '👥' },
  ]

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-57px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

import { Outlet } from 'react-router'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { OfflineIndicator } from '../OfflineIndicator'
import './layout.css'

export function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        メインコンテンツへ
      </a>
      <TopBar />
      <OfflineIndicator />
      <div className="app-body">
        <Sidebar />
        <main id="main-content" className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

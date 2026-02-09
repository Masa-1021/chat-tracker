import { Link } from 'react-router'
import { SerendieSymbolGroup, SerendieSymbolTag } from '@serendie/symbols'
import { useUserList } from '../hooks/useAdmin'
import { useThemeList } from '@/features/theme/hooks/useTheme'
import { useSavedDataList } from '@/features/data/hooks/useData'

export function AdminDashboard() {
  const { data: users } = useUserList()
  const { data: themes } = useThemeList()
  const { data: savedData } = useSavedDataList()

  const stats = [
    {
      label: 'ユーザー数',
      value: users?.length ?? '-',
      icon: <SerendieSymbolGroup size={24} />,
      link: '/admin/users',
    },
    {
      label: 'テーマ数',
      value: themes?.length ?? '-',
      icon: <SerendieSymbolTag size={24} />,
      link: '/admin/themes',
    },
    {
      label: '保存データ数',
      value: savedData?.length ?? '-',
      icon: <SerendieSymbolTag size={24} />,
      link: '/data',
    },
  ]

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>管理者ダッシュボード</h1>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="admin-stat-card"
          >
            <div className="admin-stat-icon">{stat.icon}</div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import type { SavedData, Theme, User } from '@/types'

// Serendie-aligned fallback colors (impression-primary palette)
const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#ddd6fe',
  '#818cf8',
  '#4f46e5',
  '#7c3aed',
]

interface DashboardChartsProps {
  savedData: SavedData[]
  themes: Theme[]
  users: User[]
}

// ---- Pie chart: saved-data count per theme ----

interface ThemePieEntry {
  name: string
  value: number
}

function useThemePieData(
  savedData: SavedData[],
  themes: Theme[],
): ThemePieEntry[] {
  return useMemo(() => {
    const themeMap = new Map<string, string>(
      themes.map((t) => [t.id, t.name]),
    )
    const counts = new Map<string, number>()
    for (const d of savedData) {
      if (d.isDeleted) continue
      const name = themeMap.get(d.themeId) ?? '不明'
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [savedData, themes])
}

// ---- Line chart: daily registration trend (last 30 days) ----

interface DailyEntry {
  date: string
  count: number
}

function useDailyTrendData(savedData: SavedData[]): DailyEntry[] {
  return useMemo(() => {
    const now = new Date()
    const dayMap = new Map<string, number>()

    // Initialise every day in the last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      dayMap.set(key, 0)
    }

    for (const d of savedData) {
      if (d.isDeleted) continue
      const created = new Date(d.createdAt)
      const diffMs = now.getTime() - created.getTime()
      if (diffMs < 0 || diffMs > 30 * 24 * 60 * 60 * 1000) continue
      const key = `${created.getMonth() + 1}/${created.getDate()}`
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
    }

    return Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))
  }, [savedData])
}

// ---- Bar chart: top 5 users by saved-data count ----

interface UserBarEntry {
  name: string
  count: number
}

function useUserRankingData(
  savedData: SavedData[],
  users: User[],
): UserBarEntry[] {
  return useMemo(() => {
    const userMap = new Map<string, string>(
      users.map((u) => [u.id, u.displayName || u.email]),
    )
    const counts = new Map<string, number>()
    for (const d of savedData) {
      if (d.isDeleted) continue
      counts.set(d.createdBy, (counts.get(d.createdBy) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([userId, count]) => ({
        name: userMap.get(userId) ?? userId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [savedData, users])
}

// ---- Sub-components ----

function NoData() {
  return (
    <div className="admin-chart-no-data">データなし</div>
  )
}

interface PieChartCardProps {
  data: ThemePieEntry[]
}

function ThemePieCard({ data }: PieChartCardProps) {
  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-title">テーマ別データ件数</h3>
      {data.length === 0 ? (
        <NoData />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}件`, '件数']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

interface LineChartCardProps {
  data: DailyEntry[]
}

function DailyTrendCard({ data }: LineChartCardProps) {
  const hasData = data.some((d) => d.count > 0)
  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-title">日別データ登録推移（過去30日）</h3>
      {!hasData ? (
        <NoData />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--colors-sd-system-color-component-outline-bright, #e5e7eb)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              interval={4}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              width={32}
            />
            <Tooltip formatter={(value: number) => [`${value}件`, '登録件数']} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

interface BarChartCardProps {
  data: UserBarEntry[]
}

function UserRankingCard({ data }: BarChartCardProps) {
  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-title">ユーザー活動ランキング（上位5名）</h3>
      {data.length === 0 ? (
        <NoData />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--colors-sd-system-color-component-outline-bright, #e5e7eb)" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={96}
            />
            <Tooltip formatter={(value: number) => [`${value}件`, '保存件数']} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ---- Main export ----

export function DashboardCharts({ savedData, themes, users }: DashboardChartsProps) {
  const themePieData = useThemePieData(savedData, themes)
  const dailyTrendData = useDailyTrendData(savedData)
  const userRankingData = useUserRankingData(savedData, users)

  return (
    <section className="admin-charts-section">
      <ThemePieCard data={themePieData} />
      <DailyTrendCard data={dailyTrendData} />
      <UserRankingCard data={userRankingData} />
    </section>
  )
}

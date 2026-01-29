import { Routes, Route, Navigate } from 'react-router'

// Placeholder pages
const HomePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">ホーム</h1>
    <p>Chat Tracker - AIチャット型情報管理システム</p>
  </div>
)

const LoginPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">ログイン</h1>
  </div>
)

const ChatPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">チャット</h1>
  </div>
)

const ThemesPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">テーマ管理</h1>
  </div>
)

const DataPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">保存データ</h1>
  </div>
)

const TeamsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">チーム管理</h1>
  </div>
)

const ProfilePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">プロフィール</h1>
  </div>
)

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:sessionId" element={<ChatPage />} />
      <Route path="/themes" element={<ThemesPage />} />
      <Route path="/data" element={<DataPage />} />
      <Route path="/data/:id" element={<DataPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

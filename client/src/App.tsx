import { Route, Routes, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Plan from './pages/Plan'
import Trips from './pages/Trips'
import { useAuth } from './components/AuthProvider'

export default function App() {
  const { user, loading, signIn, signOutApp } = useAuth()
  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur supports-backdrop-blur:bg-white/80 bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AI 旅行规划师</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/plan" className="btn-outline">行程规划</Link>
            <Link to="/trips" className="btn-outline">我的行程</Link>
            <span className="text-gray-500 hidden sm:inline">{loading ? '...' : user ? user.displayName || user.email : '未登录'}</span>
            {user ? (
              <button onClick={signOutApp} className="btn-outline">退出</button>
            ) : (
              <button onClick={signIn} className="btn-primary">登录</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} AI Travel Planner</footer>
    </div>
  )
}



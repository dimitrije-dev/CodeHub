import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { useAuth } from './hooks/useAuth.js'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Tasks = lazy(() => import('./pages/Tasks.jsx'))
const Snippets = lazy(() => import('./pages/Snippets.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Achievements = lazy(() => import('./pages/Achievements.jsx'))
const Pomodoro = lazy(() => import('./pages/Pomodoro.jsx'))
const AIPrompts = lazy(() => import('./pages/AIPrompts.jsx'))
const Login = lazy(() => import('./pages/Auth/Login.jsx'))
const Register = lazy(() => import('./pages/Auth/Register.jsx'))

function RequireAuth({ children }) {
  const { isAuthed } = useAuth()
  return isAuthed ? children : <Navigate to="/login" replace />
}

function AppLoader() {
  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        Loading...
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={(
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            )}
          />
          <Route
            path="/tasks"
            element={(
              <RequireAuth>
                <Tasks />
              </RequireAuth>
            )}
          />
          <Route
            path="/snippets"
            element={(
              <RequireAuth>
                <Snippets />
              </RequireAuth>
            )}
          />
          <Route
            path="/profile"
            element={(
              <RequireAuth>
                <Profile />
              </RequireAuth>
            )}
          />
          <Route
            path="/achievements"
            element={(
              <RequireAuth>
                <Achievements />
              </RequireAuth>
            )}
          />
          <Route
            path="/pomodoro"
            element={(
              <RequireAuth>
                <Pomodoro />
              </RequireAuth>
            )}
          />
          <Route
            path="/ai-prompts"
            element={(
              <RequireAuth>
                <AIPrompts />
              </RequireAuth>
            )}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

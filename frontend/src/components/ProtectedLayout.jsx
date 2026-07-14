import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import Sidebar from './Sidebar'

export default function ProtectedLayout() {
  const { authenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="session-loading">Validando sessão...</div>
  if (!authenticated) return <Navigate to="/login" replace state={{ from: location }} />

  return <div className="app"><Sidebar /><main className="content"><Outlet /></main></div>
}

import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/AuthPage'
import LandingPage from '../pages/LandingPage'
import HomePage from '../pages/HomePage'
import SearchPage from '../pages/SearchPage'
import AlertsPage from '../pages/AlertsPage'

export default function AppRoutes({ currentUser, authLoading, onAuthSuccess }) {
  if (authLoading) {
    return (
      <div className="state-msg">
        <p>Checking session...</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={onAuthSuccess} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
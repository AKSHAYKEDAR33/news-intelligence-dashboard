import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import AlertsPage from './pages/AlertsPage'
import { getCurrentUser, signOutJsonSession } from './services/authApi'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getCurrentUser()
      .then((user) => {
        if (mounted) setCurrentUser(user)
      })
      .finally(() => {
        if (mounted) setAuthLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleSignOut = () => {
    signOutJsonSession()
    setCurrentUser(null)
  }

  let pageContent = null

  if (authLoading) {
    pageContent = (
      <div className="state-msg">
        <p>Checking session...</p>
      </div>
    )
  } else if (!currentUser) {
    pageContent = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={setCurrentUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  } else {
    pageContent = (
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

  return (
    <div className="app-shell">
      <Navbar isAuthenticated={Boolean(currentUser)} onSignOut={handleSignOut} />
      <main className="container">
        {pageContent}
      </main>
      <Footer />
    </div>
  )
}

export default App

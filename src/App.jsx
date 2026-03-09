import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
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

  return (
    <div className="app-shell">
      <Navbar isAuthenticated={Boolean(currentUser)} onSignOut={handleSignOut} />
      <main className="container">
        <AppRoutes
          currentUser={currentUser}
          authLoading={authLoading}
          onAuthSuccess={setCurrentUser}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App

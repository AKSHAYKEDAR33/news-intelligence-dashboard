import { NavLink } from 'react-router-dom'

export default function Navbar({ isAuthenticated, onSignOut }) {
  return (
    <nav className="navbar">
      <NavLink to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        <span className="logo-icon" aria-hidden="true" />
        <span className="brand-name">NewsIntel</span>
      </NavLink>
      <div className="navbar-links navbar-links-main">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
              Search
            </NavLink>
            <NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>
              Alerts
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </>
        )}
      </div>
      <div className="navbar-actions">
        {isAuthenticated ? (
          <button type="button" className="btn btn-outline" onClick={onSignOut}>
            Sign Out
          </button>
        ) : (
          <NavLink to="/auth" className="btn btn-outline navbar-auth-link">
            Login / Sign Up
          </NavLink>
        )}
      </div>
    </nav>
  )
}

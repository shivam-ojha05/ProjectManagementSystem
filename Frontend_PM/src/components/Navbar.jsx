import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Dashboard</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-user" onClick={() => setMenuOpen((v) => !v)}>
          <div className="avatar">{initials}</div>
          <span className="text-muted" style={{ fontSize: 14 }}>{user?.username}</span>
        </div>
        {menuOpen && (
          <UserMenu onProfile={() => navigate('/profile')} onLogout={handleLogout} onClose={() => setMenuOpen(false)} />
        )}
      </div>
    </header>
  )
}

// A tiny inline dropdown menu — kept in the same file since it's only used here.
function UserMenu({ onProfile, onLogout, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        right: 24,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        minWidth: 160,
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseLeave={onClose}
    >
      <div className="sidebar-link" onClick={onProfile}>Profile</div>
      <div className="sidebar-link" onClick={onLogout}>Logout</div>
    </div>
  )
}

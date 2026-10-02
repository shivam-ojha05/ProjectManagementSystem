import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RoleBadge from '../components/RoleBadge'
import Button from '../components/Button'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Profile</h1>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="flex-row" style={{ marginBottom: 20 }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 style={{ marginBottom: 2 }}>{user?.name}</h3>
            {user?.role && <RoleBadge role={user.role} />}
          </div>
        </div>

        <div className="divider" />

        <div className="field">
          <label>Username</label>
          <p style={{ color: 'var(--text)' }}>{user?.username}</p>
        </div>
        <div className="field">
          <label>Email</label>
          <p style={{ color: 'var(--text)' }}>{user?.email}</p>
        </div>

        <div className="divider" />

        <div className="flex-row">
          <Button variant="secondary" onClick={() => navigate('/change-password')}>Change Password</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  )
}

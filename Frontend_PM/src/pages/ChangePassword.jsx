import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (formData.newPassword !== formData.confirmPassword) { setError('New passwords do not match.'); return }

    setError('')
    setLoading(true)
    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1200)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header"><h1>Change Password</h1></div>
      <div className="card" style={{ maxWidth: 420 }}>
        <ErrorMessage message={error} />
        {success && <div className="error-box" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>Password updated successfully.</div>}
        <form onSubmit={handleSubmit}>
          <Input id="oldPassword" name="oldPassword" type="password" label="Current password" value={formData.oldPassword} onChange={handleChange} />
          <Input id="newPassword" name="newPassword" type="password" label="New password" hint="At least 8 characters" value={formData.newPassword} onChange={handleChange} />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm new password" value={formData.confirmPassword} onChange={handleChange} />
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </div>
    </div>
  )
}

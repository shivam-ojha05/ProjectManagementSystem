import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function ResetPassword() {
  // useParams reads dynamic segments from the URL. Route is /reset-password/:token
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return }

    setError('')
    setLoading(true)
    try {
      // Backend expects "newPassword", not "password"
      await authService.resetPassword(token, { newPassword: formData.password })
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="logo-mark">PC</div>
          <span>Project Camp</span>
        </div>
        <h2>Set a new password</h2>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <Input id="password" name="password" type="password" label="New password" value={formData.password} onChange={handleChange} />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm new password" value={formData.confirmPassword} onChange={handleChange} />
          <Button type="submit" block loading={loading}>Reset Password</Button>
        </form>
        <div className="auth-footer-link"><Link to="/login">Back to login</Link></div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // `formData` is STATE: React re-renders this component every time it changes.
  // useState(initialValue) returns [currentValue, functionToUpdateIt].
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // One generic change handler for every input, using each input's `name` attribute
  // to know which field of formData to update. Saves writing a handler per field.
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the browser's default full-page-reload form submit
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      await login(formData)
      const redirectTo = location.state?.from || '/dashboard'
      navigate(redirectTo, { replace: true })
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
        <h2>Welcome back</h2>
        <p style={{ marginBottom: 20 }}>Log in to continue to your projects.</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <Link to="/forgot-password" style={{ fontSize: 13 }}>Forgot password?</Link>
          </div>
          <Button type="submit" block loading={loading}>Log In</Button>
        </form>

        <div className="auth-footer-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

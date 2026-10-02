import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', username: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      return 'Please fill in all fields.'
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters.'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  const validationError = validate()
  if (validationError) {
    setError(validationError)
    return
  }

  setError('')
  setLoading(true)
  try {
    const { confirmPassword, name, ...rest } = formData
    await authService.register({
      ...rest,
      fullname: name,
      username: rest.username.toLowerCase(),
    })
    setSuccess(true)
  } catch (err) {
    setError(getErrorMessage(err))
  } finally {
    setLoading(false)
  }
}

  // Conditional rendering: once registration succeeds, we swap the form
  // for a "check your email" message instead of navigating away —
  // because the backend requires email verification before login.
  if (success) {
    return (
      <div className="auth-layout">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="logo-mark">PC</div>
            <span>Project Camp</span>
          </div>
          <h2>Check your email</h2>
          <p>
            We've sent a verification link to <strong>{formData.email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <Button block onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="logo-mark">PC</div>
          <span>Project Camp</span>
        </div>
        <h2>Create your account</h2>
        <p style={{ marginBottom: 20 }}>Start organizing your projects.</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <Input id="name" name="name" label="Full name" value={formData.name} onChange={handleChange} />
          <Input id="email" name="email" type="email" label="Email" value={formData.email} onChange={handleChange} />
          <Input id="username" name="username" label="Username" value={formData.username} onChange={handleChange} />
          <Input id="password" name="password" type="password" label="Password" hint="At least 8 characters" value={formData.password} onChange={handleChange} />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
          <Button type="submit" block loading={loading}>Create Account</Button>
        </form>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

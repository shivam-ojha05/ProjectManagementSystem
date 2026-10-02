import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/authService'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
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
        <h2>Reset your password</h2>

        {sent ? (
          <p>If an account exists for <strong>{email}</strong>, a reset link has been sent.</p>
        ) : (
          <>
            <p style={{ marginBottom: 20 }}>Enter your email and we'll send you a reset link.</p>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit}>
              <Input id="email" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" block loading={loading}>Send Reset Link</Button>
            </form>
          </>
        )}

        <div className="auth-footer-link">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  )
}

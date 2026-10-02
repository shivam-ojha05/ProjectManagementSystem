import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import authService from '../services/authService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'

export default function VerifyEmail() {
  const { token } = useParams()
  // status drives which UI we show: 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  // Runs once when the page loads, using the token from the URL.
  useEffect(() => {
    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(getErrorMessage(err))
      })
  }, [token])

  return (
    <div className="auth-layout">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-brand" style={{ justifyContent: 'center' }}>
          <div className="logo-mark">PC</div>
          <span>Project Camp</span>
        </div>

        {status === 'loading' && <Loading label="Verifying your email..." />}

        {status === 'success' && (
          <>
            <h2>Email verified 🎉</h2>
            <p>Your account is now active.</p>
            <Link to="/login" className="btn btn-primary btn-block">Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h2>Verification failed</h2>
            <p>{message}</p>
            <Link to="/login" className="btn btn-secondary btn-block">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  )
}

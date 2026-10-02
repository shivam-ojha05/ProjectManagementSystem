import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from './Loading'

// Wraps any page that requires login (per PRD section 7).
// - While we're still checking auth status on first load -> show a spinner
// - If not authenticated -> redirect to /login
// - Otherwise -> render the protected page
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth()

  if (!authChecked) {
    return <Loading label="Checking session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

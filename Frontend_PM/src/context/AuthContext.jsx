import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

// createContext gives us a "box" that any component in the tree can read from,
// without passing props down manually through every level (avoids "prop drilling").
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // user: the logged-in user's info (null if not logged in)
  // authChecked: have we finished checking "is there a valid session?" on app load
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  // useEffect with an empty [] dependency array runs ONCE, right after the app mounts.
  // This is how we check "is the user already logged in?" (e.g. they refreshed the page)
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setAuthChecked(true)
      return
    }
    authService
      .getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('accessToken')
        setUser(null)
      })
      .finally(() => setAuthChecked(true))
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { accessToken, user: loggedInUser } = res.data
    localStorage.setItem('accessToken', accessToken)
    setUser(loggedInUser)
    return res
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('accessToken')
      setUser(null)
    }
  }

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    authChecked,
    login,
    logout,
  }

  // Every component wrapped by <AuthProvider> can now access `value` via useAuth()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

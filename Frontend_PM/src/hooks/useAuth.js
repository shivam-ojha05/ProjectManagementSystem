import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Small convenience hook so components write `useAuth()` instead of
// `useContext(AuthContext)` everywhere. This is a very common React pattern.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

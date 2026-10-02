import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'

// Public / auth pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

// Protected pages
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './pages/ProjectDetails'
import Members from './pages/Members'
import ProjectTasks from './pages/ProjectTasks'
import Tasks from './pages/Tasks'
import TaskDetails from './pages/TaskDetails'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'

// Wraps every protected page with the Navbar + Sidebar shell.
function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { authChecked } = useAuth()

  // Don't render any routes until we know whether the user is logged in —
  // avoids a flash of the login page for someone who's actually authenticated.
  if (!authChecked) {
    return <Loading label="Loading Project Camp..." />
  }

  return (
    <Routes>
      {/* ---------- Public routes ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ---------- Protected routes ---------- */}
      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/create" element={
        <ProtectedRoute><AppLayout><CreateProject /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:projectId" element={
        <ProtectedRoute><AppLayout><ProjectDetails /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:projectId/members" element={
        <ProtectedRoute><AppLayout><Members /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:projectId/tasks" element={
        <ProtectedRoute><AppLayout><ProjectTasks /></AppLayout></ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>
      } />
      <Route path="/tasks/:taskId" element={
        <ProtectedRoute><AppLayout><TaskDetails /></AppLayout></ProtectedRoute>
      } />
      <Route path="/notes" element={
        <ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>
      } />
      <Route path="/change-password" element={
        <ProtectedRoute><AppLayout><ChangePassword /></AppLayout></ProtectedRoute>
      } />

      {/* ---------- Fallback ---------- */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

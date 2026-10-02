import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import projectService from '../services/projectService'
import taskService from '../services/taskService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import ProjectCard from '../components/ProjectCard'
import TaskCard from '../components/TaskCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Dashboard PRD: real stats, recent projects, recent tasks — all from the backend.
    // We fetch the user's projects, then pull tasks from the most recent one (if any)
    // since the backend's task list is scoped per project.
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const projectsRes = await projectService.list()
        const projectList = projectsRes.data || []
        setProjects(projectList)

        if (projectList.length > 0) {
          const mostRecent = projectList[0]
          const tasksRes = await taskService.list(mostRecent._id)
          setTasks((tasksRes.data || []).slice(0, 5))
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loading label="Loading dashboard..." />

  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.fullname?.split(' ')[0] || user?.username}</h1>
          <p>Here's what's happening across your projects.</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">+ New Project</Link>
      </div>

      <ErrorMessage message={error} />

      <div className="stat-grid">
        <div className="stat-card">
          <span className="text-muted" style={{ fontSize: 13 }}>Total Projects</span>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card">
          <span className="text-muted" style={{ fontSize: 13 }}>Recent Tasks</span>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-card">
          <span className="text-muted" style={{ fontSize: 13 }}>Completed Tasks</span>
          <div className="stat-value">{doneCount}</div>
        </div>
      </div>

      <h2>Recent Projects</h2>
      {projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects yet.</h3>
          <p>Create your first project to get started.</p>
          <Link to="/projects/create" className="btn btn-primary">+ Create Project</Link>
        </div>
      ) : (
        <div className="card-grid">
          {projects.slice(0, 6).map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}

      {tasks.length > 0 && (
        <>
          <h2 className="mt-24">Recent Tasks</h2>
          <div className="card-grid">
            {tasks.map((t) => <TaskCard key={t._id} task={t} projectId={t.project} />)}
          </div>
        </>
      )}
    </div>
  )
}

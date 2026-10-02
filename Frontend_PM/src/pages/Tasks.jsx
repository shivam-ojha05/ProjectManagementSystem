import { useEffect, useState } from 'react'
import projectService from '../services/projectService'
import taskService from '../services/taskService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import TaskCard from '../components/TaskCard'

// Route: /tasks — "My Tasks" aggregated across every project the user belongs to.
// The backend only exposes tasks scoped by project (GET /tasks/:projectId), so
// we fetch the user's projects first, then fetch each project's tasks in parallel.
export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const projectsRes = await projectService.list()
        const projects = projectsRes.data || []

        const taskLists = await Promise.all(
          projects.map((p) =>
            taskService
              .list(p._id)
              .then((res) => (res.data || []).map((t) => ({ ...t, project: p._id, projectName: p.name })))
              .catch(() => [])
          )
        )

        setTasks(taskLists.flat())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loading label="Loading your tasks..." />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Tasks across all your projects.</p>
        </div>
      </div>

      <ErrorMessage message={error} />

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found.</h3>
          <p>Tasks you create or get assigned will show up here.</p>
        </div>
      ) : (
        <div className="card-grid">
          {tasks.map((t) => <TaskCard key={t._id} task={t} projectId={t.project} />)}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import taskService from '../services/taskService'
import memberService from '../services/memberService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import TaskCard from '../components/TaskCard'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'

// Route: /projects/:projectId/tasks — tasks scoped to ONE project, with create-task support.
export default function ProjectTasks() {
  const { projectId } = useParams()

  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '', status: 'todo', dueDate: '' })
  const [creating, setCreating] = useState(false)

  const loadTasks = () => {
    setLoading(true)
    Promise.all([taskService.list(projectId), memberService.list(projectId)])
      .then(([taskRes, memberRes]) => {
        setTasks(taskRes.data || [])
        setMembers(memberRes.data || [])
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadTasks, [projectId])

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    setCreating(true)
    setError('')
    try {
      await taskService.create(projectId, formData)
      setCreateOpen(false)
      setFormData({ title: '', description: '', assignedTo: '', status: 'todo', dueDate: '' })
      loadTasks()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <Loading label="Loading tasks..." />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <Link to={`/projects/${projectId}`} className="text-muted" style={{ fontSize: 13 }}>&larr; Back to project</Link>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Create Task</Button>
      </div>

      <ErrorMessage message={error} />

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found.</h3>
          <Button onClick={() => setCreateOpen(true)}>+ Create Task</Button>
        </div>
      ) : (
        <div className="card-grid">
          {tasks.map((t) => <TaskCard key={t._id} task={t} projectId={projectId} />)}
        </div>
      )}

      <Modal
        open={createOpen}
        title="Create Task"
        onClose={() => setCreateOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate}>Create Task</Button>
          </>
        }
      >
        <Input name="title" label="Title" value={formData.title} onChange={handleChange} />
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Assign to</label>
          <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.user?._id} value={m.user?._id}>{m.user?.username}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <Input name="dueDate" type="date" label="Due date" value={formData.dueDate} onChange={handleChange} />
      </Modal>
    </div>
  )
}

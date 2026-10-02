import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import taskService from '../services/taskService'
import projectService from '../services/projectService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'

const STATUSES = ['todo', 'in_progress', 'done']

export default function TaskDetails() {
  const { taskId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // The route is /tasks/:taskId (no projectId), but the backend needs a projectId
  // to look up a task. We get it from navigation state (set by TaskCard) when
  // available; otherwise we fall back to searching the user's projects for it.
  const [projectId, setProjectId] = useState(location.state?.projectId || null)
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newSubtask, setNewSubtask] = useState('')
  const [addingSubtask, setAddingSubtask] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [uploading, setUploading] = useState(false)

  const resolveProjectAndLoad = async () => {
    setLoading(true)
    setError('')
    try {
      let pid = projectId
      if (!pid) {
        // Fallback: search across the user's projects for this task.
        const projectsRes = await projectService.list()
        for (const p of projectsRes.data || []) {
          try {
            const res = await taskService.getById(p._id, taskId)
            pid = p._id
            setProjectId(pid)
            setTask(res.data)
            break
          } catch {
            // not in this project, keep looking
          }
        }
        if (!pid) throw new Error('Task not found in any of your projects.')
      } else {
        const res = await taskService.getById(pid, taskId)
        setTask(res.data)
      }
    } catch (err) {
      setError(err.message?.includes('not found') ? err.message : getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { resolveProjectAndLoad() }, [taskId])

  const handleStatusChange = async (status) => {
    try {
      const res = await taskService.update(projectId, taskId, { status })
      setTask(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    setAddingSubtask(true)
    try {
      await taskService.createSubtask(projectId, taskId, { title: newSubtask })
      setNewSubtask('')
      const res = await taskService.getById(projectId, taskId)
      setTask(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setAddingSubtask(false)
    }
  }

  const handleToggleSubtask = async (subtask) => {
    try {
      await taskService.updateSubtask(projectId, subtask._id, { isCompleted: !subtask.isCompleted })
      const res = await taskService.getById(projectId, taskId)
      setTask(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await taskService.removeSubtask(projectId, subtaskId)
      const res = await taskService.getById(projectId, taskId)
      setTask(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      for (const file of files) formData.append('attachments', file)
      const res = await taskService.update(projectId, taskId, formData)
      setTask(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTask = async () => {
    setDeleting(true)
    try {
      await taskService.remove(projectId, taskId)
      navigate(`/projects/${projectId}/tasks`)
    } catch (err) {
      setError(getErrorMessage(err))
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) return <Loading label="Loading task..." />
  if (!task) return <div className="page"><ErrorMessage message={error || 'Task not found.'} /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{task.title}</h1>
          {projectId && (
            <Link to={`/projects/${projectId}/tasks`} className="text-muted" style={{ fontSize: 13 }}>
              &larr; Back to project tasks
            </Link>
          )}
        </div>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete Task</Button>
      </div>

      <ErrorMessage message={error} />

      <div className="card" style={{ marginBottom: 20 }}>
        <p>{task.description || 'No description provided.'}</p>

        <div className="divider" />

        <div className="flex-row" style={{ flexWrap: 'wrap', gap: 24 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Status</label>
            <div className="flex-row">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`badge badge-${s}`}
                  style={{ cursor: 'pointer', border: task.status === s ? '1px solid currentColor' : '1px solid transparent' }}
                  onClick={() => handleStatusChange(s)}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {task.assignedTo?.username && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Assigned to</label>
              <span>{task.assignedTo.username}</span>
            </div>
          )}

          {task.dueDate && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>Due date</label>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subtasks */}
      <h2>Subtasks</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        {(!task.subtasks || task.subtasks.length === 0) ? (
          <p className="text-muted">No subtasks yet.</p>
        ) : (
          task.subtasks.map((st) => (
            <div key={st._id} className="subtask-row">
              <div
                className={`checkbox ${st.isCompleted ? 'checked' : ''}`}
                onClick={() => handleToggleSubtask(st)}
              >
                {st.isCompleted && '✓'}
              </div>
              <span style={{ flex: 1, textDecoration: st.isCompleted ? 'line-through' : 'none', color: st.isCompleted ? 'var(--text-faint)' : 'var(--text)' }}>
                {st.title}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteSubtask(st._id)}>Remove</button>
            </div>
          ))
        )}

        <form onSubmit={handleAddSubtask} className="flex-row mt-16">
          <input
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            style={{ flex: 1, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)' }}
          />
          <Button type="submit" loading={addingSubtask} variant="secondary">Add</Button>
        </form>
      </div>

      {/* Attachments */}
      <h2>Attachments</h2>
      <div className="card">
        {task.attachments?.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {task.attachments.map((att, i) => (
              <li key={i}><a href={att.url} target="_blank" rel="noreferrer">{att.url.split('/').pop()}</a></li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No attachments yet.</p>
        )}
        <div className="mt-16">
          <input type="file" multiple onChange={handleFileUpload} disabled={uploading} />
          {uploading && <span className="text-muted" style={{ marginLeft: 10, fontSize: 13 }}>Uploading...</span>}
        </div>
      </div>

      <Modal
        open={deleteOpen}
        title="Delete Task"
        onClose={() => setDeleteOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDeleteTask}>Delete Task</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{task.title}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  )
}

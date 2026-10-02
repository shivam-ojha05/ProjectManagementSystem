import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import projectService from '../services/projectService'
import memberService from '../services/memberService'
import taskService from '../services/taskService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import TaskCard from '../components/TaskCard'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // The backend is the authority on permissions, but we still hide/show
  // admin-only actions here so the UI doesn't offer buttons that would 403.
  // getProjectById doesn't embed members, so we fetch the member list
  // separately and find our own role in it (same approach as Members.jsx).
  const myRole = members.find((m) => m.user?._id === user?._id)?.role
  const isAdmin = myRole === 'admin'

const loadProject = () => {
    setLoading(true)
    setError('')

    Promise.all([projectService.getById(projectId), memberService.list(projectId)])
      .then(([projectRes, membersRes]) => {
        setProject(projectRes.data)
        setEditData({ name: projectRes.data.name, description: projectRes.data.description || '' })
        setMembers(membersRes.data || [])
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))

    taskService
      .list(projectId)
      .then((res) => setTasks(res.data || []))
      .catch(() => setTasks([]))
  }

  useEffect(loadProject, [projectId])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await projectService.update(projectId, editData)
      setProject(res.data)
      setEditOpen(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await projectService.remove(projectId)
      navigate('/projects')
    } catch (err) {
      setError(getErrorMessage(err))
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) return <Loading label="Loading project..." />
  if (!project) return <div className="page"><ErrorMessage message={error || 'Project not found.'} /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description || 'No description provided.'}</p>
        </div>
        <div className="flex-row">
          <Link to={`/projects/${projectId}/members`} className="btn btn-secondary">Members</Link>
          {isAdmin && <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>}
          {isAdmin && <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete</Button>}
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="flex-between">
        <h2>Tasks</h2>
        <Link to={`/projects/${projectId}/tasks`} className="btn btn-primary btn-sm">View All Tasks</Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found.</h3>
          <p>Create the first task for this project.</p>
          <Link to={`/projects/${projectId}/tasks`} className="btn btn-primary">+ Create Task</Link>
        </div>
      ) : (
        <div className="card-grid">
          {tasks.slice(0, 6).map((t) => <TaskCard key={t._id} task={t} projectId={projectId} />)}
        </div>
      )}

      {/* Edit project modal */}
      <Modal
        open={editOpen}
        title="Edit Project"
        onClose={() => setEditOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleUpdate}>Save Changes</Button>
          </>
        }
      >
        <Input
          label="Project name"
          value={editData.name}
          onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
        />
        <div className="field">
          <label>Description</label>
          <textarea value={editData.description} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} />
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteOpen}
        title="Delete Project"
        onClose={() => setDeleteOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete Project</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{project.name}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import projectService from '../services/projectService'
import noteService from '../services/noteService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Button from '../components/Button'

// Backend notes are scoped per project (GET /notes/:projectId), so this page
// lets the user pick which project's notes to view via a dropdown.
export default function Notes() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [notesLoading, setNotesLoading] = useState(false)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const canManageNotes = user?.role === 'admin'

  useEffect(() => {
    projectService
      .list()
      .then((res) => {
        const list = res.data || []
        setProjects(list)
        if (list.length > 0) setSelectedProject(list[0]._id)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const loadNotes = () => {
    if (!selectedProject) return
    setNotesLoading(true)
    noteService
      .list(selectedProject)
      .then((res) => setNotes(res.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setNotesLoading(false))
  }

  useEffect(loadNotes, [selectedProject])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      await noteService.create(selectedProject, { content })
      setContent('')
      setCreateOpen(false)
      loadNotes()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (!confirm('Delete this note?')) return
    try {
      await noteService.remove(selectedProject, noteId)
      loadNotes()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Loading label="Loading notes..." />

  if (projects.length === 0) {
    return (
      <div className="page">
        <div className="page-header"><h1>Notes</h1></div>
        <div className="empty-state">
          <h3>No projects yet.</h3>
          <p>Create a project first to add notes to it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ marginTop: 8 }}>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        {canManageNotes && <Button onClick={() => setCreateOpen(true)}>+ Add Note</Button>}
      </div>

      <ErrorMessage message={error} />

      {notesLoading ? (
        <Loading label="Loading notes..." />
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet for this project.</h3>
        </div>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="card mt-16">
            <div className="flex-between">
              <p style={{ margin: 0, color: 'var(--text)' }}>{note.content}</p>
              {canManageNotes && (
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(note._id)}>Delete</button>
              )}
            </div>
            <div className="text-faint" style={{ fontSize: 12, marginTop: 10 }}>
              {note.createdBy?.username && `by ${note.createdBy.username} · `}
              {new Date(note.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}

      <Modal
        open={createOpen}
        title="Add Note"
        onClose={() => setCreateOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleCreate}>Add Note</Button>
          </>
        }
      >
        <div className="field">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
        </div>
      </Modal>
    </div>
  )
}

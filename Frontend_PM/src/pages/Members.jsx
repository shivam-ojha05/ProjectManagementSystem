import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import memberService from '../services/memberService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import MemberCard from '../components/MemberCard'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Members() {
  const { projectId } = useParams()
  const { user } = useAuth()

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [addOpen, setAddOpen] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState('member')
  const [adding, setAdding] = useState(false)

  const myRole = members.find((m) => m.user?._id === user?._id)?.role
  // Role lives on ProjectMember, scoped per project — there's no global
  // user.role on the User model, so this is the only source of truth.
  const canManage = myRole === 'admin'

  const loadMembers = () => {
    setLoading(true)
    memberService
      .list(projectId)
      .then((res) => setMembers(res.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadMembers, [projectId])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!addEmail.trim()) return
    setAdding(true)
    setError('')
    try {
      await memberService.add(projectId, { email: addEmail, role: addRole })
      setAddOpen(false)
      setAddEmail('')
      setAddRole('member')
      loadMembers()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove this member from the project?')) return
    try {
      await memberService.remove(projectId, userId)
      loadMembers()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Loading label="Loading members..." />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Project Members</h1>
          <Link to={`/projects/${projectId}`} className="text-muted" style={{ fontSize: 13 }}>&larr; Back to project</Link>
        </div>
        {canManage && <Button onClick={() => setAddOpen(true)}>+ Add Member</Button>}
      </div>

      <ErrorMessage message={error} />

      {members.length === 0 ? (
        <div className="empty-state">
          <h3>No members have been added to this project yet.</h3>
          {canManage && <Button onClick={() => setAddOpen(true)}>+ Add Member</Button>}
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <MemberCard key={m.user?._id} member={m} canManage={canManage} onRemove={handleRemove} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={addOpen}
        title="Add Member"
        onClose={() => setAddOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button loading={adding} onClick={handleAdd}>Add Member</Button>
          </>
        }
      >
        <Input
          label="User email"
          placeholder="teammate@example.com"
          value={addEmail}
          onChange={(e) => setAddEmail(e.target.value)}
          hint="Must be a registered user's email."
        />
        <div className="field">
          <label>Role</label>
          <select value={addRole} onChange={(e) => setAddRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="project_admin">Project Admin</option>
          </select>
        </div>
      </Modal>
    </div>
  )
}

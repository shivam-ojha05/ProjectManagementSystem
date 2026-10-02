import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import projectService from '../services/projectService'
import { getErrorMessage } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'

export default function CreateProject() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) { setError('Project name is required.'); return }

    setError('')
    setLoading(true)
    try {
      const res = await projectService.create(formData)
      // Backend returns the created project -> jump straight to its detail page.
      navigate(`/projects/${res.data._id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header"><h1>Create Project</h1></div>
      <div className="card" style={{ maxWidth: 480 }}>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <Input id="name" name="name" label="Project name" placeholder="e.g. Website Redesign" value={formData.name} onChange={handleChange} />
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="What's this project about?" value={formData.description} onChange={handleChange} />
          </div>
          <div className="flex-row">
            <Button type="submit" loading={loading}>Create Project</Button>
            <Link to="/projects" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

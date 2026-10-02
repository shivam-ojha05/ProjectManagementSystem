import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import projectService from '../services/projectService'
import { getErrorMessage } from '../services/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    projectService
      .list()
      .then((res) => setProjects(res.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Loading projects..." />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Projects you're a part of.</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">+ New Project</Link>
      </div>

      <ErrorMessage message={error} />

      {projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects yet.</h3>
          <p>Create your first project.</p>
          <Link to="/projects/create" className="btn btn-primary">+ Create Project</Link>
        </div>
      ) : (
        <div className="card-grid">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}
    </div>
  )
}

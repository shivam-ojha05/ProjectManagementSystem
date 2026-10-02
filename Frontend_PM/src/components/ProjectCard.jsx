import { useNavigate } from 'react-router-dom'

// Displays one project's summary info. `project` comes straight from the backend —
// nothing here is hardcoded (per PRD's "no manual data" rule).
export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div className="entity-card" onClick={() => navigate(`/projects/${project._id}`)}>
      <div className="entity-card-top">
        <h3>{project.name}</h3>
      </div>
      <p style={{ fontSize: 13.5 }}>
        {project.description || 'No description provided.'}
      </p>
      <div className="entity-card-meta">
        <span>{project.memberCount ?? 0} members</span>
        {project.createdAt && (
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  )
}

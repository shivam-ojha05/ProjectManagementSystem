import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

// Displays one task in a list. Clicking it navigates to /tasks/:taskId.
// `projectId` is needed too since task detail routes are scoped by project on the backend.
export default function TaskCard({ task, projectId }) {
  const navigate = useNavigate()

  return (
    <div
      className="entity-card"
      onClick={() => navigate(`/tasks/${task._id}`, { state: { projectId } })}
    >
      <div className="entity-card-top">
        <h3>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p style={{ fontSize: 13.5 }}>{task.description || 'No description provided.'}</p>
      <div className="entity-card-meta">
        {task.assignedTo?.username && <span>Assigned to {task.assignedTo.username}</span>}
        {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}

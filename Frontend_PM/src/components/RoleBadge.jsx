// Same idea as StatusBadge, but for the three PRD roles: admin, project_admin, member.
const LABELS = {
  admin: 'Admin',
  project_admin: 'Project Admin',
  member: 'Member',
}

export default function RoleBadge({ role }) {
  return <span className={`badge badge-${role}`}>{LABELS[role] || role}</span>
}

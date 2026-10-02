import RoleBadge from './RoleBadge'

// One row in the project members list.
// `onRemove` and `canManage` are passed down from the parent page based on the
// current user's role for this project (role-based UI, PRD section 22).
export default function MemberCard({ member, canManage, onRemove }) {
  const initials = member.user?.username ? member.user.username.slice(0, 2).toUpperCase() : '??'

  return (
    <tr>
      <td>
        <div className="flex-row">
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</div>
          <span>{member.user?.username || member.user?.fullname}</span>
        </div>
      </td>
      <td className="text-muted">{member.user?.email}</td>
      <td><RoleBadge role={member.role} /></td>
      <td>
        {canManage && (
          <button className="btn btn-danger btn-sm" onClick={() => onRemove(member.user?._id)}>
            Remove
          </button>
        )}
      </td>
    </tr>
  )
}

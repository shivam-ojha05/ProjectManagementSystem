// Maps backend status values (todo / in_progress / done) to a styled badge.
// Backend values are always used in API calls; only the LABEL is prettified for display.
const LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] || status}</span>
}

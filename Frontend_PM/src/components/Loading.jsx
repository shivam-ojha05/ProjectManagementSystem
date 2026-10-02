// A single reusable loading spinner + message.
// Used anywhere we're waiting on an API call (per PRD section 30).
export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="loading-wrap">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}

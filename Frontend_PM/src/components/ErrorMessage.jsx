// A single reusable error box. Pass it any human-readable message string.
// If there's no message, it renders nothing (so you can always drop it in JSX
// without an extra `{error && ...}` check at the call site... though we still
// check `if (!message) return null` here).
export default function ErrorMessage({ message }) {
  if (!message) return null
  return <div className="error-box">{message}</div>
}

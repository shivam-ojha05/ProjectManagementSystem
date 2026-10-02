// A reusable labeled input with an optional error message underneath.
// forwardRef isn't needed here since we're not doing anything fancy with focus,
// so this stays a plain component.
export default function Input({ label, error, hint, id, ...rest }) {
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...rest} />
      {error && <div className="field-error">{error}</div>}
      {!error && hint && <div className="field-hint">{hint}</div>}
    </div>
  )
}

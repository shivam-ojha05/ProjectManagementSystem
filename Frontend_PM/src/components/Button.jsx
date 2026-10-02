// A reusable button that knows how to show a loading spinner and disable itself.
// variant: 'primary' | 'secondary' | 'danger' | 'ghost'
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  block = false,
  className = '',
  disabled,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="spinner spinner-sm" />}
      {children}
    </button>
  )
}

import './FormField.css'

export default function FormField({ label, error, children }) {
  return <label className={error ? 'field-invalid' : ''}>
    <span>{label}</span>
    {children}
    {error && <small className="field-error">{error.message}</small>}
  </label>
}

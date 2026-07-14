import './FilterForm.css'
import './FormField.css'
import { Search } from 'lucide-react'

export default function FilterForm({ fields, values, onChange, onSubmit, loading = false, className = '' }) {
  return (
    <form className={`filters ${className}`.trim()} onSubmit={onSubmit}>
      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          <input placeholder={field.placeholder} value={values[field.name]} onChange={(event) => onChange(field.name, field.format ? field.format(event.target.value) : event.target.value)} />
        </label>
      ))}
      <div className="filter-actions"><button type="submit" className="primary-button search-button" disabled={loading}><Search size={18} />{loading ? 'Pesquisando...' : 'Pesquisar'}</button></div>
    </form>
  )
}

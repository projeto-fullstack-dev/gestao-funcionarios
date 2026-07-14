import { Check, X } from 'lucide-react'
import './Form.css'

export default function FormActions({ loading, onCancel }) {
  return <div className="bottom-actions">
    <button type="button" className="outline-button large" onClick={onCancel}><X size={24} />Cancelar</button>
    <button type="submit" className="primary-button large" disabled={loading}><Check size={24} />Confirmar</button>
  </div>
}

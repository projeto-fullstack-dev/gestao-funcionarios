import { Trash2, X } from 'lucide-react'
import './Modal.css'

export default function DeleteModal({ title, itemLabel, onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}><X size={22} /></button>
        <h2>{title}</h2>
        <p>Tem certeza que deseja excluir <strong>{itemLabel}</strong>?</p>
        <p className="modal-warning">Essa ação não poderá ser desfeita.</p>
        <div className="modal-actions">
          <button className="outline-button large" onClick={onClose}>Cancelar</button>
          <button className="danger-button large" onClick={onConfirm}><Trash2 size={22} />Excluir</button>
        </div>
      </div>
    </div>
  )
}

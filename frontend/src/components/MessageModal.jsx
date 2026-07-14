import { X } from 'lucide-react'
import './Modal.css'

export default function MessageModal({ message, onClose }) {
  if (!message) return null
  return <div className="modal-overlay"><div className="modal">
    <button className="modal-close" onClick={onClose}><X size={22} /></button>
    <h2>Atenção</h2><p>{message}</p>
    <div className="modal-actions"><button type="button" className="primary-button large" onClick={onClose}>Entendi</button></div>
  </div></div>
}

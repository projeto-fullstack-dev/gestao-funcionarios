import { Pencil, Trash2 } from 'lucide-react'
import './RowActions.css'

export default function RowActions({ onEdit, onDelete }) {
  return <>
    <td><button className="icon-button" onClick={onEdit}><Pencil size={22} /></button></td>
    <td><button className="icon-button danger" onClick={onDelete}><Trash2 size={22} /></button></td>
  </>
}

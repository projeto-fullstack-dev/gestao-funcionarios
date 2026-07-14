import { Download, Plus } from 'lucide-react'
import './PageHeader.css'

export default function PageHeader({ title, description, createLabel, onCreate, onDownload, downloading = false }) {
  return (
    <div className="page-header">
      <div><h1>{title}</h1><p>{description}</p></div>
      <div className="header-actions">
        {onDownload && <button className="outline-button" onClick={onDownload} disabled={downloading}><Download size={20} />{downloading ? 'Gerando...' : 'Baixar Relatório'}</button>}
        <button className="outline-button" onClick={onCreate}><Plus size={20} />{createLabel}</button>
      </div>
    </div>
  )
}

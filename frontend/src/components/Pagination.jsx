import './Pagination.css'

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination">
      <button className="outline-button" onClick={() => onChange(page - 1)} disabled={page === 0}>Anterior</button>
      <span>Página {totalPages === 0 ? 0 : page + 1} de {totalPages}</span>
      <button className="outline-button" onClick={() => onChange(page + 1)} disabled={page + 1 >= totalPages}>Próxima</button>
    </div>
  )
}

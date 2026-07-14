import './ListError.css'

export default function ListError({ message, onRetry, onClose }) {
  if (!message) return null
  return <div className="list-error" role="alert">
    <span>{message}</span>
    <div><button type="button" onClick={onRetry}>Tentar novamente</button><button type="button" onClick={onClose}>Fechar</button></div>
  </div>
}

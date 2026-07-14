import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return <section className="not-found">
    <strong>404</strong>
    <h1>Página não encontrada</h1>
    <p>O endereço informado não existe ou foi removido.</p>
    <Link className="primary-button large" to="/funcionarios"><ArrowLeft size={20} />Voltar para funcionários</Link>
  </section>
}

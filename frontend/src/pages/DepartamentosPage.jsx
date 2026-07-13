import { Download, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function DepartamentosPage() {
  const navigate = useNavigate()

  const [departamentos, setDepartamentos] = useState([])
  const [buscaDescricao, setBuscaDescricao] = useState('')
  const [buscaCodigo, setBuscaCodigo] = useState('')
  const [departamentoParaExcluir, setDepartamentoParaExcluir] = useState(null)

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const tamanhoPagina = 5

  async function carregarDepartamentos(paginaAtual = pagina) {
    const response = await api.get('/departamentos', {
  params: {
    descricao: buscaDescricao,
    codigo: buscaCodigo,
    page: paginaAtual,
    size: tamanhoPagina,
  },
})

    setDepartamentos(response.data.content || [])
    setPagina(response.data.number ?? paginaAtual)
    setTotalPaginas(response.data.totalPages ?? 0)
  }

  useEffect(() => {
    carregarDepartamentos(0)
  }, [])

  async function pesquisar(event) {
    event.preventDefault()
    await carregarDepartamentos(0)
  }

  async function paginaAnterior() {
    if (pagina === 0) return
    await carregarDepartamentos(pagina - 1)
  }

  async function proximaPagina() {
    if (pagina + 1 >= totalPaginas) return
    await carregarDepartamentos(pagina + 1)
  }

  function baixarRelatorio() {
    window.open('http://localhost:8080/api/departamentos/relatorio', '_blank')
  }

  async function confirmarExclusao() {
    if (!departamentoParaExcluir) return

    try {
      await api.delete(`/departamentos/${departamentoParaExcluir.id}`)
      setDepartamentoParaExcluir(null)
      await carregarDepartamentos(pagina)
    } catch (error) {
      const mensagem =
        error.response?.data?.erro ||
        'Não foi possível excluir este departamento. Verifique se ele está vinculado a algum funcionário.'

      alert(mensagem)
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Departamentos</h1>
          <p>Veja os departamentos cadastrados no sistema.</p>
        </div>

        <div className="header-actions">
          <button className="outline-button" onClick={baixarRelatorio}>
            <Download size={20} />
            Baixar Relatório
          </button>

          <button
            className="outline-button"
            onClick={() => navigate('/departamentos/novo')}
          >
            <Plus size={20} />
            Novo Departamento
          </button>
        </div>
      </div>

      <div className="card">
        <form className="filters" onSubmit={pesquisar}>
          <label>
            <span>Descrição do Departamento</span>
            <input
              placeholder="Procure pelo nome do departamento"
              value={buscaDescricao}
              onChange={(event) => setBuscaDescricao(event.target.value)}
            />
          </label>

          <label>
            <span>Código</span>
            <input
              placeholder="Procure pelo código do departamento"
              value={buscaCodigo}
              onChange={(event) => setBuscaCodigo(event.target.value)}
            />
          </label>

          <button type="submit" className="hidden-submit">
            Pesquisar
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Editar</th>
              <th>Excluir</th>
              <th>Descrição</th>
              <th>Código</th>
            </tr>
          </thead>

          <tbody>
            {departamentos.map((departamento) => (
              <tr key={departamento.id}>
                <td>
                  <button
                    className="icon-button"
                    onClick={() =>
                      navigate(`/departamentos/${departamento.id}/editar`)
                    }
                  >
                    <Pencil size={22} />
                  </button>
                </td>

                <td>
                  <button
                    className="icon-button danger"
                    onClick={() => setDepartamentoParaExcluir(departamento)}
                  >
                    <Trash2 size={22} />
                  </button>
                </td>

                <td>{departamento.descricao}</td>
                <td>{departamento.codigo}</td>
              </tr>
            ))}

            {departamentos.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  Nenhum departamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="outline-button"
            onClick={paginaAnterior}
            disabled={pagina === 0}
          >
            Anterior
          </button>

          <span>
            Página {totalPaginas === 0 ? 0 : pagina + 1} de {totalPaginas}
          </span>

          <button
            className="outline-button"
            onClick={proximaPagina}
            disabled={pagina + 1 >= totalPaginas}
          >
            Próxima
          </button>
        </div>
      </div>

      {departamentoParaExcluir && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setDepartamentoParaExcluir(null)}
            >
              <X size={22} />
            </button>

            <h2>Excluir Departamento</h2>

            <p>
              Tem certeza que deseja excluir o departamento{' '}
              <strong>{departamentoParaExcluir.descricao}</strong>?
            </p>

            <p className="modal-warning">
              Essa ação não poderá ser desfeita.
            </p>

            <div className="modal-actions">
              <button
                className="outline-button large"
                onClick={() => setDepartamentoParaExcluir(null)}
              >
                Cancelar
              </button>

              <button
                className="danger-button large"
                onClick={confirmarExclusao}
              >
                <Trash2 size={22} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
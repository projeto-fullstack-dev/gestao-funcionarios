import { Download, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function CargosPage() {
  const navigate = useNavigate()

  const [cargos, setCargos] = useState([])
  const [buscaDescricao, setBuscaDescricao] = useState('')
  const [buscaCodigo, setBuscaCodigo] = useState('')
  const [cargoParaExcluir, setCargoParaExcluir] = useState(null)

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const tamanhoPagina = 5

  async function carregarCargos(paginaAtual = pagina) {
    const response = await api.get('/cargos', {
  params: {
    descricao: buscaDescricao,
    codigo: buscaCodigo,
    page: paginaAtual,
    size: tamanhoPagina,
  },
})

    setCargos(response.data.content || [])
    setPagina(response.data.number ?? paginaAtual)
    setTotalPaginas(response.data.totalPages ?? 0)
  }

  useEffect(() => {
    carregarCargos(0)
  }, [])

  async function pesquisar(event) {
    event.preventDefault()
    await carregarCargos(0)
  }

  async function paginaAnterior() {
    if (pagina === 0) return
    await carregarCargos(pagina - 1)
  }

  async function proximaPagina() {
    if (pagina + 1 >= totalPaginas) return
    await carregarCargos(pagina + 1)
  }

  function baixarRelatorio() {
    window.open('http://localhost:8080/api/cargos/relatorio', '_blank')
  }

  async function confirmarExclusao() {
    if (!cargoParaExcluir) return

    try {
      await api.delete(`/cargos/${cargoParaExcluir.id}`)
      setCargoParaExcluir(null)
      await carregarCargos(pagina)
    } catch (error) {
      const mensagem =
        error.response?.data?.erro ||
        'Não foi possível excluir este cargo. Verifique se ele está vinculado a algum funcionário.'

      alert(mensagem)
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Cargos</h1>
          <p>Veja os cargos cadastrados no sistema.</p>
        </div>

        <div className="header-actions">
          <button className="outline-button" onClick={baixarRelatorio}>
            <Download size={20} />
            Baixar Relatório
          </button>

          <button
            className="outline-button"
            onClick={() => navigate('/cargos/novo')}
          >
            <Plus size={20} />
            Novo Cargo
          </button>
        </div>
      </div>

      <div className="card">
        <form className="filters" onSubmit={pesquisar}>
          <label>
            <span>Descrição do Cargo</span>
            <input
              placeholder="Procure pelo nome do cargo"
              value={buscaDescricao}
              onChange={(event) => setBuscaDescricao(event.target.value)}
            />
          </label>

          <label>
            <span>Código</span>
            <input
              placeholder="Procure pelo código do cargo"
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
            {cargos.map((cargo) => (
              <tr key={cargo.id}>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => navigate(`/cargos/${cargo.id}/editar`)}
                  >
                    <Pencil size={22} />
                  </button>
                </td>

                <td>
                  <button
                    className="icon-button danger"
                    onClick={() => setCargoParaExcluir(cargo)}
                  >
                    <Trash2 size={22} />
                  </button>
                </td>

                <td>{cargo.descricao}</td>
                <td>{cargo.codigo}</td>
              </tr>
            ))}

            {cargos.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  Nenhum cargo encontrado.
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

      {cargoParaExcluir && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setCargoParaExcluir(null)}
            >
              <X size={22} />
            </button>

            <h2>Excluir Cargo</h2>

            <p>
              Tem certeza que deseja excluir o cargo{' '}
              <strong>{cargoParaExcluir.descricao}</strong>?
            </p>

            <p className="modal-warning">
              Essa ação não poderá ser desfeita.
            </p>

            <div className="modal-actions">
              <button
                className="outline-button large"
                onClick={() => setCargoParaExcluir(null)}
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
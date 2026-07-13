import { Download, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function FuncionariosPage() {
  const navigate = useNavigate()

  const [funcionarios, setFuncionarios] = useState([])

  const [buscaNome, setBuscaNome] = useState('')
  const [buscaCpf, setBuscaCpf] = useState('')
  const [buscaMatricula, setBuscaMatricula] = useState('')
  const [buscaEmpresa, setBuscaEmpresa] = useState('')
  const [buscaCargo, setBuscaCargo] = useState('')
  const [buscaDepartamento, setBuscaDepartamento] = useState('')

  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null)

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const tamanhoPagina = 5

  async function carregarFuncionarios(paginaAtual = pagina) {
    const response = await api.get('/funcionarios', {
      params: {
        nome: buscaNome,
        cpf: buscaCpf,
        matricula: buscaMatricula,
        empresa: buscaEmpresa,
        cargo: buscaCargo,
        departamento: buscaDepartamento,
        page: paginaAtual,
        size: tamanhoPagina,
      },
    })

    setFuncionarios(response.data.content || [])
    setPagina(response.data.number ?? paginaAtual)
    setTotalPaginas(response.data.totalPages ?? 0)
  }

  useEffect(() => {
    carregarFuncionarios(0)
  }, [])

  async function pesquisar(event) {
    event.preventDefault()
    await carregarFuncionarios(0)
  }

  async function paginaAnterior() {
    if (pagina === 0) return
    await carregarFuncionarios(pagina - 1)
  }

  async function proximaPagina() {
    if (pagina + 1 >= totalPaginas) return
    await carregarFuncionarios(pagina + 1)
  }

  function baixarRelatorio() {
    window.open('http://localhost:8080/api/funcionarios/relatorio', '_blank')
  }

  function obterCargos(funcionario) {
    return funcionario.vinculos
      ?.map((vinculo) => vinculo.cargo?.descricao)
      .filter(Boolean)
      .join(', ')
  }

  function obterDepartamentos(funcionario) {
    return funcionario.vinculos
      ?.map((vinculo) => vinculo.departamento?.descricao)
      .filter(Boolean)
      .join(', ')
  }

  function obterEmpresas(funcionario) {
    return funcionario.vinculos
      ?.map((vinculo) => vinculo.empresa)
      .filter(Boolean)
      .join(', ')
  }

  function obterMatriculas(funcionario) {
    return funcionario.vinculos
      ?.map((vinculo) => vinculo.matricula)
      .filter(Boolean)
      .join(', ')
  }

  async function confirmarExclusao() {
    if (!funcionarioParaExcluir) return

    try {
      await api.delete(`/funcionarios/${funcionarioParaExcluir.id}`)
      setFuncionarioParaExcluir(null)
      await carregarFuncionarios(pagina)
    } catch (error) {
      const mensagem =
        error.response?.data?.erro || 'Não foi possível excluir este funcionário.'

      alert(mensagem)
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Funcionários</h1>
          <p>Veja os funcionários cadastrados no sistema.</p>
        </div>

        <div className="header-actions">
          <button className="outline-button" onClick={baixarRelatorio}>
            <Download size={20} />
            Baixar Relatório
          </button>

          <button
            className="outline-button"
            onClick={() => navigate('/funcionarios/novo')}
          >
            <Plus size={20} />
            Novo Funcionário
          </button>
        </div>
      </div>

      <div className="card">
        <form className="filters funcionarios-filters-completo" onSubmit={pesquisar}>
          <label>
            <span>Nome do Funcionário</span>
            <input
              placeholder="Procure pelo nome"
              value={buscaNome}
              onChange={(event) => setBuscaNome(event.target.value)}
            />
          </label>

          <label>
            <span>CPF</span>
            <input
              placeholder="Procure pelo CPF"
              value={buscaCpf}
              onChange={(event) => setBuscaCpf(event.target.value)}
            />
          </label>

          <label>
            <span>Matrícula</span>
            <input
              placeholder="Procure pela matrícula"
              value={buscaMatricula}
              onChange={(event) => setBuscaMatricula(event.target.value)}
            />
          </label>

          <label>
            <span>Empresa</span>
            <input
              placeholder="Procure pela empresa"
              value={buscaEmpresa}
              onChange={(event) => setBuscaEmpresa(event.target.value)}
            />
          </label>

          <label>
            <span>Cargo</span>
            <input
              placeholder="Procure pelo cargo"
              value={buscaCargo}
              onChange={(event) => setBuscaCargo(event.target.value)}
            />
          </label>

          <label>
            <span>Departamento</span>
            <input
              placeholder="Procure pelo departamento"
              value={buscaDepartamento}
              onChange={(event) => setBuscaDepartamento(event.target.value)}
            />
          </label>

          <button type="submit" className="hidden-submit">
            Pesquisar
          </button>
        </form>

        <p className="filter-info">
          Acesse o cadastro do funcionário para verificar os vínculos de empresa.
        </p>

        <table>
          <thead>
            <tr>
              <th>Editar</th>
              <th>Excluir</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Matrícula(s)</th>
              <th>Empresa(s)</th>
              <th>Cargo(s)</th>
              <th>Departamento(s)</th>
            </tr>
          </thead>

          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => navigate(`/funcionarios/${funcionario.id}/editar`)}
                  >
                    <Pencil size={22} />
                  </button>
                </td>

                <td>
                  <button
                    className="icon-button danger"
                    onClick={() => setFuncionarioParaExcluir(funcionario)}
                  >
                    <Trash2 size={22} />
                  </button>
                </td>

                <td>{funcionario.nome}</td>
                <td>{funcionario.cpf}</td>
                <td>{obterMatriculas(funcionario)}</td>
                <td>{obterEmpresas(funcionario)}</td>
                <td>{obterCargos(funcionario)}</td>
                <td>{obterDepartamentos(funcionario)}</td>
              </tr>
            ))}

            {funcionarios.length === 0 && (
              <tr>
                <td colSpan="8" className="empty">
                  Nenhum funcionário encontrado.
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

      {funcionarioParaExcluir && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setFuncionarioParaExcluir(null)}
            >
              <X size={22} />
            </button>

            <h2>Excluir Funcionário</h2>

            <p>
              Tem certeza que deseja excluir o funcionário{' '}
              <strong>{funcionarioParaExcluir.nome}</strong>?
            </p>

            <p className="modal-warning">
              Essa ação não poderá ser desfeita.
            </p>

            <div className="modal-actions">
              <button
                className="outline-button large"
                onClick={() => setFuncionarioParaExcluir(null)}
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
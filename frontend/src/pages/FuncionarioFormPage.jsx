import { Check, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function FuncionarioFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [vinculos, setVinculos] = useState([])
  const [cargos, setCargos] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [carregando, setCarregando] = useState(false)

  const [modalAberto, setModalAberto] = useState(false)
  const [indiceEditando, setIndiceEditando] = useState(null)
  const [empresaModal, setEmpresaModal] = useState('')
  const [matriculaModal, setMatriculaModal] = useState('')
  const [cargoIdModal, setCargoIdModal] = useState('')
  const [departamentoIdModal, setDepartamentoIdModal] = useState('')

  const [mensagemErro, setMensagemErro] = useState('')

  const modoEdicao = Boolean(id)

  useEffect(() => {
    carregarOpcoes()
    carregarFuncionario()
  }, [id])

  async function carregarOpcoes() {
    const [cargosResponse, departamentosResponse] = await Promise.all([
      api.get('/cargos', { params: { page: 0, size: 100 } }),
      api.get('/departamentos', { params: { page: 0, size: 100 } }),
    ])

    setCargos(cargosResponse.data.content || [])
    setDepartamentos(departamentosResponse.data.content || [])
  }

  async function carregarFuncionario() {
    if (!id) return

    const response = await api.get(`/funcionarios/${id}`)
    const funcionario = response.data

    setNome(funcionario.nome)
    setCpf(funcionario.cpf)
    setVinculos(funcionario.vinculos || [])
  }

  function abrirModalNovoVinculo() {
    setIndiceEditando(null)
    setEmpresaModal('')
    setMatriculaModal('')
    setCargoIdModal('')
    setDepartamentoIdModal('')
    setModalAberto(true)
  }

  function abrirModalEditarVinculo(vinculo, index) {
    setIndiceEditando(index)
    setEmpresaModal(vinculo.empresa)
    setMatriculaModal(vinculo.matricula)
    setCargoIdModal(String(vinculo.cargo?.id || ''))
    setDepartamentoIdModal(String(vinculo.departamento?.id || ''))
    setModalAberto(true)
  }

  function salvarVinculo() {
    if (!empresaModal.trim() || !matriculaModal.trim() || !cargoIdModal || !departamentoIdModal) {
      setMensagemErro('Preencha todos os dados do vínculo.')
      return
    }

    const cargoSelecionado = cargos.find((cargo) => cargo.id === Number(cargoIdModal))
    const departamentoSelecionado = departamentos.find(
      (departamento) => departamento.id === Number(departamentoIdModal)
    )

    const novoVinculo = {
      empresa: empresaModal,
      matricula: matriculaModal,
      cargo: cargoSelecionado,
      departamento: departamentoSelecionado,
    }

    if (indiceEditando !== null) {
      const copia = [...vinculos]
      copia[indiceEditando] = novoVinculo
      setVinculos(copia)
    } else {
      setVinculos([...vinculos, novoVinculo])
    }

    setModalAberto(false)
  }

  function removerVinculo(index) {
    const copia = vinculos.filter((_, posicao) => posicao !== index)
    setVinculos(copia)
  }

  async function salvarFuncionario(event) {
    event.preventDefault()

    if (!nome.trim() || !cpf.trim()) {
      setMensagemErro('Preencha nome e CPF do funcionário.')
      return
    }

    if (vinculos.length === 0) {
      setMensagemErro('Adicione pelo menos um vínculo ao funcionário.')
      return
    }

    const dados = {
      nome,
      cpf,
      vinculos: vinculos.map((vinculo) => ({
        empresa: vinculo.empresa,
        matricula: vinculo.matricula,
        cargo: {
          id: vinculo.cargo.id,
        },
        departamento: {
          id: vinculo.departamento.id,
        },
      })),
    }

    try {
      setCarregando(true)

      if (modoEdicao) {
        await api.put(`/funcionarios/${id}`, dados)
      } else {
        await api.post('/funcionarios', dados)
      }

      navigate('/funcionarios')
    } catch (error) {
      const mensagem =
        error.response?.data?.erro || 'Erro ao salvar funcionário.'

      setMensagemErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="form-page wide">
      <div className="form-title">
        <h1>{modoEdicao ? 'Editar Funcionário' : 'Cadastro de Funcionário'}</h1>
        <p>
          {modoEdicao
            ? 'Altere os dados e vínculos do funcionário'
            : 'Adicione as informações do novo funcionário'}
        </p>
      </div>

      <form onSubmit={salvarFuncionario}>
        <div className="form-card">
          <h2>Informações Gerais</h2>

          <div className="form-grid two-columns">
            <label>
              <span>Nome do Funcionário</span>
              <input
                placeholder="Insira o nome do funcionário"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />
            </label>

            <label>
              <span>CPF</span>
              <input
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(event) => setCpf(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="form-card vinculos-card">
          <div className="section-header">
            <h2>Vínculos Empresariais</h2>

            <button type="button" className="outline-button" onClick={abrirModalNovoVinculo}>
              <Plus size={20} />
              Novo Vínculo
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Editar</th>
                <th>Excluir</th>
                <th>Empresa</th>
                <th>Matrícula</th>
                <th>Cargo</th>
                <th>Departamento</th>
              </tr>
            </thead>

            <tbody>
              {vinculos.map((vinculo, index) => (
                <tr key={`${vinculo.empresa}-${vinculo.matricula}-${index}`}>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => abrirModalEditarVinculo(vinculo, index)}
                    >
                      Editar
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={() => removerVinculo(index)}
                    >
                      <Trash2 size={22} />
                    </button>
                  </td>

                  <td>{vinculo.empresa}</td>
                  <td>{vinculo.matricula}</td>
                  <td>{vinculo.cargo?.descricao}</td>
                  <td>{vinculo.departamento?.descricao}</td>
                </tr>
              ))}

              {vinculos.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    Nenhum vínculo adicionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bottom-actions">
          <button
            type="button"
            className="outline-button large"
            onClick={() => navigate('/funcionarios')}
          >
            <X size={24} />
            Cancelar
          </button>

          <button type="submit" className="primary-button large" disabled={carregando}>
            <Check size={24} />
            Confirmar
          </button>
        </div>
      </form>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal vinculo-modal">
            <button className="modal-close" onClick={() => setModalAberto(false)}>
              <X size={22} />
            </button>

            <h2>{indiceEditando !== null ? 'Editar Vínculo' : 'Novo Vínculo'}</h2>

            <div className="form-grid modal-grid">
              <label>
                <span>Nome da Empresa</span>
                <input
                  placeholder="Insira o nome da empresa"
                  value={empresaModal}
                  onChange={(event) => setEmpresaModal(event.target.value)}
                />
              </label>

              <label>
                <span>Matrícula</span>
                <input
                  placeholder="Insira a matrícula"
                  value={matriculaModal}
                  onChange={(event) => setMatriculaModal(event.target.value)}
                />
              </label>

              <label>
                <span>Cargo</span>
                <select
                  value={cargoIdModal}
                  onChange={(event) => setCargoIdModal(event.target.value)}
                >
                  <option value="">Selecione um cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.descricao}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Departamento</span>
                <select
                  value={departamentoIdModal}
                  onChange={(event) => setDepartamentoIdModal(event.target.value)}
                >
                  <option value="">Selecione um departamento</option>
                  {departamentos.map((departamento) => (
                    <option key={departamento.id} value={departamento.id}>
                      {departamento.descricao}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="outline-button large"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>

              <button type="button" className="primary-button large" onClick={salvarVinculo}>
                <Check size={22} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setMensagemErro('')}>
              <X size={22} />
            </button>

            <h2>Atenção</h2>

            <p>{mensagemErro}</p>

            <div className="modal-actions">
              <button
                type="button"
                className="primary-button large"
                onClick={() => setMensagemErro('')}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
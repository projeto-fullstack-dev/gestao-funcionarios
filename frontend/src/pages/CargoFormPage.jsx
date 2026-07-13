import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function CargoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [descricao, setDescricao] = useState('')
  const [codigo, setCodigo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')

  const modoEdicao = Boolean(id)

  useEffect(() => {
    async function carregarCargo() {
      if (!id) return

      const response = await api.get(`/cargos/${id}`)

      setDescricao(response.data.descricao)
      setCodigo(response.data.codigo)
    }

    carregarCargo()
  }, [id])

  async function salvar(event) {
    event.preventDefault()

    if (!descricao.trim() || !codigo.trim()) {
      setMensagemErro('Preencha descrição e código do cargo.')
      return
    }

    try {
      setCarregando(true)

      const dados = {
        descricao,
        codigo,
      }

      if (modoEdicao) {
        await api.put(`/cargos/${id}`, dados)
      } else {
        await api.post('/cargos', dados)
      }

      navigate('/cargos')
    } catch (error) {
      const mensagem =
        error.response?.data?.erro || 'Erro ao salvar cargo.'

      setMensagemErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="form-page">
      <div className="form-title">
        <h1>{modoEdicao ? 'Editar Cargo' : 'Cadastro de Cargo'}</h1>
        <p>
          {modoEdicao
            ? 'Altere as informações deste cargo'
            : 'Adicione as informações do novo cargo'}
        </p>
      </div>

      <form onSubmit={salvar}>
        <div className="form-card">
          <h2>Informações Gerais</h2>

          <div className="form-grid two-columns">
            <label>
              <span>Descrição do Cargo</span>
              <input
                placeholder="Insira o nome do cargo"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </label>

            <label>
              <span>Código do Cargo</span>
              <input
                placeholder="0000000000"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="bottom-actions">
          <button
            type="button"
            className="outline-button large"
            onClick={() => navigate('/cargos')}
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
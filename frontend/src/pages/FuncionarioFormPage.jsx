import { Check, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import FormActions from '../components/FormActions'
import FormField from '../components/FormField'
import FormHeader from '../components/FormHeader'
import { getApiError } from '../lib/api'
import { cargoService } from '../services/cargoService'
import { departamentoService } from '../services/departamentoService'
import { funcionarioService } from '../services/funcionarioService'
import { empresaService } from '../services/empresaService'
import { isValidCpf, maskCpf } from '../utils/cpf'
import '../components/Form.css'
import '../components/Modal.css'

const emptyLink = { empresaId: '', matricula: '', cargoId: '', departamentoId: '' }

export default function FuncionarioFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [links, setLinks] = useState([])
  const [positions, setPositions] = useState({ empresas: [], cargos: [], departamentos: [] })
  const [linkModal, setLinkModal] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [apiError, setApiError] = useState('')

  const employeeForm = useForm({ mode: 'onChange', defaultValues: { nome: '', cpf: '' } })
  const linkForm = useForm({ mode: 'onChange', defaultValues: emptyLink })
  const { reset: resetEmployee } = employeeForm

  useEffect(() => {
    Promise.all([empresaService.list({ page: 0, size: 100 }), cargoService.list({ page: 0, size: 100 }), departamentoService.list({ page: 0, size: 100 })])
      .then(([empresas, cargos, departamentos]) => setPositions({ empresas: empresas.content || [], cargos: cargos.content || [], departamentos: departamentos.content || [] }))
      .catch((error) => setApiError(getApiError(error, 'Erro ao carregar as opções.')))

    if (id) funcionarioService.getById(id)
      .then((employee) => { resetEmployee({ nome: employee.nome, cpf: maskCpf(employee.cpf) }); setLinks(employee.vinculos || []) })
      .catch((error) => setApiError(getApiError(error, 'Erro ao carregar o funcionário.')))
  }, [id, resetEmployee])

  function openNewLink() {
    setEditingLink(null)
    linkForm.reset(emptyLink)
    setLinkModal(true)
  }

  function openEditLink(link, index) {
    setEditingLink(index)
    linkForm.reset({ empresaId: String(link.empresa?.id || ''), matricula: link.matricula, cargoId: String(link.cargo?.id || ''), departamentoId: String(link.departamento?.id || '') })
    setLinkModal(true)
  }

  function saveLink(data) {
    const link = {
      empresa: positions.empresas.find((item) => item.id === Number(data.empresaId)),
      matricula: data.matricula,
      cargo: positions.cargos.find((item) => item.id === Number(data.cargoId)),
      departamento: positions.departamentos.find((item) => item.id === Number(data.departamentoId)),
    }
    setLinks((current) => editingLink === null ? [...current, link] : current.map((item, index) => index === editingLink ? link : item))
    employeeForm.clearErrors('vinculos')
    setLinkModal(false)
  }

  async function saveEmployee(data) {
    if (links.length === 0) {
      employeeForm.setError('vinculos', { message: 'Adicione pelo menos um vínculo empresarial.' })
      return
    }
    try {
      setApiError('')
      const payload = funcionarioService.toPayload({ ...data, vinculos: links })
      if (id) await funcionarioService.update(id, payload)
      else await funcionarioService.create(payload)
      navigate('/funcionarios')
    } catch (error) { setApiError(getApiError(error, 'Erro ao salvar funcionário.')) }
  }

  const { errors, isSubmitting } = employeeForm.formState
  const linkErrors = linkForm.formState.errors
  const cpfField = employeeForm.register('cpf', {
    required: 'Informe o CPF.',
    validate: (value) => isValidCpf(value) || 'Informe um CPF válido.',
  })

  return <section className="form-page wide">
    <FormHeader editing={Boolean(id)} entity="Funcionário" />
    <form onSubmit={employeeForm.handleSubmit(saveEmployee)} noValidate>
      <div className="form-card">
        <h2>Informações Gerais</h2>
        <div className="form-grid two-columns">
          <FormField label="Nome do Funcionário" error={errors.nome}><input placeholder="Insira o nome do funcionário" {...employeeForm.register('nome', { required: 'Informe o nome.', minLength: { value: 3, message: 'Use pelo menos 3 caracteres.' } })} /></FormField>
          <FormField label="CPF" error={errors.cpf}><input inputMode="numeric" maxLength={14} placeholder="000.000.000-00" {...cpfField} onChange={(event) => { event.target.value = maskCpf(event.target.value); cpfField.onChange(event) }} /></FormField>
        </div>
      </div>

      <div className="form-card vinculos-card">
        <div className="section-header"><h2>Vínculos Empresariais</h2><button type="button" className="outline-button" onClick={openNewLink}><Plus size={20} />Novo Vínculo</button></div>
        {errors.vinculos && <p className="form-error" role="alert">{errors.vinculos.message}</p>}
        <table><thead><tr><th>Editar</th><th>Excluir</th><th>Empresa</th><th>Matrícula</th><th>Cargo</th><th>Departamento</th></tr></thead>
          <tbody>
            {links.map((link, index) => <tr key={`${link.empresa?.id}-${link.matricula}-${index}`}>
              <td><button type="button" className="icon-button" onClick={() => openEditLink(link, index)}>Editar</button></td>
              <td><button type="button" className="icon-button danger" onClick={() => setLinks((current) => current.filter((_, position) => position !== index))}><Trash2 size={22} /></button></td>
              <td>{link.empresa?.nome}</td><td>{link.matricula}</td><td>{link.cargo?.descricao}</td><td>{link.departamento?.descricao}</td>
            </tr>)}
            {links.length === 0 && <tr><td colSpan="6" className="empty">Nenhum vínculo adicionado.</td></tr>}
          </tbody>
        </table>
      </div>
      {apiError && <p className="form-error" role="alert">{apiError}</p>}
      <FormActions loading={isSubmitting} onCancel={() => navigate('/funcionarios')} />
    </form>

    {linkModal && <div className="modal-overlay"><form className="modal vinculo-modal" onSubmit={linkForm.handleSubmit(saveLink)} noValidate>
      <button type="button" className="modal-close" onClick={() => setLinkModal(false)}><X size={22} /></button>
      <h2>{editingLink === null ? 'Novo Vínculo' : 'Editar Vínculo'}</h2>
      <div className="form-grid modal-grid">
        <FormField label="Empresa" error={linkErrors.empresaId}><select {...linkForm.register('empresaId', { required: 'Selecione uma empresa.' })}><option value="">Selecione uma empresa</option>{positions.empresas.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></FormField>
        <FormField label="Matrícula" error={linkErrors.matricula}><input inputMode="numeric" pattern="[0-9]*" placeholder="Insira a matrícula" {...linkForm.register('matricula', { required: 'Informe a matrícula.', pattern: { value: /^\d+$/, message: 'A matrícula deve conter apenas números.' } })} /></FormField>
        <FormField label="Cargo" error={linkErrors.cargoId}><select {...linkForm.register('cargoId', { required: 'Selecione um cargo.' })}><option value="">Selecione um cargo</option>{positions.cargos.map((item) => <option key={item.id} value={item.id}>{item.descricao}</option>)}</select></FormField>
        <FormField label="Departamento" error={linkErrors.departamentoId}><select {...linkForm.register('departamentoId', { required: 'Selecione um departamento.' })}><option value="">Selecione um departamento</option>{positions.departamentos.map((item) => <option key={item.id} value={item.id}>{item.descricao}</option>)}</select></FormField>
      </div>
      <div className="modal-actions"><button type="button" className="outline-button large" onClick={() => setLinkModal(false)}>Cancelar</button><button type="submit" className="primary-button large"><Check size={22} />Confirmar</button></div>
    </form></div>}
  </section>
}

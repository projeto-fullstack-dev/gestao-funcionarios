import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import FormActions from '../components/FormActions'
import FormField from '../components/FormField'
import FormHeader from '../components/FormHeader'
import { getApiError } from '../lib/api'
import { empresaService } from '../services/empresaService'
import { isValidCnpj, maskCnpj } from '../utils/cnpj'

export default function EmpresaFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [apiError, setApiError] = useState('')
  const form = useForm({ mode: 'onChange', defaultValues: { nome: '', razaoSocial: '', cnpj: '' } })
  const { reset } = form
  useEffect(() => { if (id) empresaService.getById(id).then((item) => reset({ ...item, cnpj: maskCnpj(item.cnpj) })).catch((error) => setApiError(getApiError(error))) }, [id, reset])

  async function save(data) {
    try { setApiError(''); const payload = { ...data, cnpj: maskCnpj(data.cnpj) }; if (id) await empresaService.update(id, payload); else await empresaService.create(payload); navigate('/empresas') }
    catch (error) { setApiError(getApiError(error, 'Erro ao salvar empresa.')) }
  }
  const cnpjField = form.register('cnpj', { required: 'Informe o CNPJ.', validate: (value) => isValidCnpj(value) || 'Informe um CNPJ válido.' })
  return <section className="form-page"><FormHeader editing={Boolean(id)} entity="Empresa" />
    <form onSubmit={form.handleSubmit(save)} noValidate><div className="form-card"><h2>Informações Gerais</h2><div className="form-grid">
      <FormField label="Nome" error={form.formState.errors.nome}><input {...form.register('nome', { required: 'Informe o nome.' })} /></FormField>
      <FormField label="Razão Social" error={form.formState.errors.razaoSocial}><input {...form.register('razaoSocial', { required: 'Informe a razão social.' })} /></FormField>
      <FormField label="CNPJ" error={form.formState.errors.cnpj}><input inputMode="numeric" maxLength={18} placeholder="00.000.000/0000-00" {...cnpjField} onChange={(event) => { event.target.value = maskCnpj(event.target.value); cnpjField.onChange(event) }} /></FormField>
    </div></div>{apiError && <p className="form-error">{apiError}</p>}<FormActions loading={form.formState.isSubmitting} onCancel={() => navigate('/empresas')} /></form>
  </section>
}

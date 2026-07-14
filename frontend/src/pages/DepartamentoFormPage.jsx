import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import DescriptionCodeFields from '../components/DescriptionCodeFields'
import FormActions from '../components/FormActions'
import FormHeader from '../components/FormHeader'
import { getApiError } from '../lib/api'
import { departamentoService } from '../services/departamentoService'

export default function DepartamentoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange', defaultValues: { descricao: '', codigo: '' } })

  useEffect(() => {
    if (!id) return
    departamentoService.getById(id).then(reset).catch((error) => setApiError(getApiError(error)))
  }, [id, reset])

  async function save(data) {
    try {
      setApiError('')
      if (id) await departamentoService.update(id, data)
      else await departamentoService.create(data)
      navigate('/departamentos')
    } catch (error) { setApiError(getApiError(error, 'Erro ao salvar departamento.')) }
  }

  return <section className="form-page">
    <FormHeader editing={Boolean(id)} entity="Departamento" />
    <form onSubmit={handleSubmit(save)} noValidate>
      <DescriptionCodeFields entity="Departamento" register={register} errors={errors} />
      {apiError && <p className="form-error" role="alert">{apiError}</p>}
      <FormActions loading={isSubmitting} onCancel={() => navigate('/departamentos')} />
    </form>
  </section>
}

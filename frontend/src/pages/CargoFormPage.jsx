import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import DescriptionCodeFields from '../components/DescriptionCodeFields'
import FormActions from '../components/FormActions'
import FormHeader from '../components/FormHeader'
import { getApiError } from '../lib/api'
import { cargoService } from '../services/cargoService'

export default function CargoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange', defaultValues: { descricao: '', codigo: '' } })

  useEffect(() => {
    if (!id) return
    cargoService.getById(id).then(reset).catch((error) => setApiError(getApiError(error)))
  }, [id, reset])

  async function save(data) {
    try {
      setApiError('')
      if (id) await cargoService.update(id, data)
      else await cargoService.create(data)
      navigate('/cargos')
    } catch (error) { setApiError(getApiError(error, 'Erro ao salvar cargo.')) }
  }

  return <section className="form-page">
    <FormHeader editing={Boolean(id)} entity="Cargo" />
    <form onSubmit={handleSubmit(save)} noValidate>
      <DescriptionCodeFields entity="Cargo" register={register} errors={errors} />
      {apiError && <p className="form-error" role="alert">{apiError}</p>}
      <FormActions loading={isSubmitting} onCancel={() => navigate('/cargos')} />
    </form>
  </section>
}

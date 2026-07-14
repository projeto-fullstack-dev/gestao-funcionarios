import FormField from './FormField'
import './Form.css'

export default function DescriptionCodeFields({ entity, register, errors }) {
  const name = entity.toLowerCase()
  return <div className="form-card">
    <h2>Informações Gerais</h2>
    <div className="form-grid two-columns">
      <FormField label={`Descrição do ${entity}`} error={errors.descricao}><input placeholder={`Insira o nome do ${name}`} {...register('descricao', { required: 'Informe a descrição.', minLength: { value: 2, message: 'Use pelo menos 2 caracteres.' } })} /></FormField>
      <FormField label={`Código do ${entity}`} error={errors.codigo}><input placeholder="0000000000" {...register('codigo', { required: 'Informe o código.' })} /></FormField>
    </div>
  </div>
}

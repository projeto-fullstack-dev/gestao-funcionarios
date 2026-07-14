import './Form.css'

export default function FormHeader({ editing, entity }) {
  return (
    <div className="form-title">
      <h1>{editing ? `Editar ${entity}` : `Cadastro de ${entity}`}</h1>
      <p>{editing ? `Altere as informações deste ${entity.toLowerCase()}` : `Adicione as informações do novo ${entity.toLowerCase()}`}</p>
    </div>
  )
}

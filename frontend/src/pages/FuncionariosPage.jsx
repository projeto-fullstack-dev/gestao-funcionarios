import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../components/DeleteModal'
import FilterForm from '../components/FilterForm'
import ListError from '../components/ListError'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import RowActions from '../components/RowActions'
import { useRelatorioPdf } from '../hooks/useRelatorioPdf'
import { alterarFiltroFuncionario, aplicarFiltrosFuncionario, carregarFuncionarios, excluirFuncionario, limparErroFuncionario, selecionarFuncionario } from '../store/funcionariosStore'
import { maskCpf } from '../utils/cpf'

const filterFields = [
  { name: 'nome', label: 'Nome do Funcionário', placeholder: 'Procure pelo nome' },
  { name: 'cpf', label: 'CPF', placeholder: '000.000.000-00', format: maskCpf },
  { name: 'matricula', label: 'Matrícula', placeholder: 'Procure pela matrícula' },
  { name: 'empresa', label: 'Empresa', placeholder: 'Procure pela empresa' },
  { name: 'cargo', label: 'Cargo', placeholder: 'Procure pelo cargo' },
  { name: 'departamento', label: 'Departamento', placeholder: 'Procure pelo departamento' },
]

const joinLinks = (employee, getValue) => employee.vinculos?.map(getValue).filter(Boolean).join(', ')

export default function FuncionariosPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, filters, selected, page, totalPages, error, loading } = useSelector((state) => state.funcionarios)
  const { gerarRelatorio, gerandoRelatorio } = useRelatorioPdf('FUNCIONARIOS')

  useEffect(() => { dispatch(carregarFuncionarios(0)) }, [dispatch])

  return <section>
    <PageHeader title="Funcionários" description="Veja os funcionários cadastrados no sistema." createLabel="Novo Funcionário" onCreate={() => navigate('/funcionarios/novo')} onDownload={gerarRelatorio} downloading={gerandoRelatorio} />
    <div className="card">
      <FilterForm fields={filterFields} values={filters} loading={loading} className="funcionarios-filters-completo" onChange={(name, value) => dispatch(alterarFiltroFuncionario({ name, value }))} onSubmit={(event) => { event.preventDefault(); dispatch(aplicarFiltrosFuncionario()); dispatch(carregarFuncionarios({ page: 0, filters })) }} />
      <ListError message={error} onRetry={() => dispatch(carregarFuncionarios(page))} onClose={() => dispatch(limparErroFuncionario())} />
      <p className="filter-info">Acesse o cadastro do funcionário para verificar os vínculos de empresa.</p>
      <table><thead><tr><th>Editar</th><th>Excluir</th><th>Nome</th><th>CPF</th><th>Matrícula(s)</th><th>Empresa(s)</th><th>Cargo(s)</th><th>Departamento(s)</th></tr></thead>
        <tbody>
          {items.map((item) => <tr key={item.id}>
            <RowActions onEdit={() => navigate(`/funcionarios/${item.id}/editar`)} onDelete={() => dispatch(selecionarFuncionario(item))} />
            <td>{item.nome}</td><td>{maskCpf(item.cpf)}</td>
            <td>{joinLinks(item, (link) => link.matricula)}</td><td>{joinLinks(item, (link) => link.empresa?.nome)}</td>
            <td>{joinLinks(item, (link) => link.cargo?.descricao)}</td><td>{joinLinks(item, (link) => link.departamento?.descricao)}</td>
          </tr>)}
          {items.length === 0 && <tr><td colSpan="8" className="empty">Nenhum funcionário encontrado.</td></tr>}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onChange={(newPage) => dispatch(carregarFuncionarios(newPage))} />
    </div>
    {selected && <DeleteModal title="Excluir Funcionário" itemLabel={selected.nome} onClose={() => dispatch(selecionarFuncionario(null))} onConfirm={() => dispatch(excluirFuncionario(selected.id))} />}
  </section>
}

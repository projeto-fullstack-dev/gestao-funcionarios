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
import { alterarFiltroDepartamento, aplicarFiltrosDepartamento, carregarDepartamentos, excluirDepartamento, limparErroDepartamento, selecionarDepartamento } from '../store/departamentosStore'

const filterFields = [
  { name: 'descricao', label: 'Descrição do Departamento', placeholder: 'Procure pelo nome do departamento' },
  { name: 'codigo', label: 'Código', placeholder: 'Procure pelo código do departamento' },
]

export default function DepartamentosPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, filters, selected, page, totalPages, error, loading } = useSelector((state) => state.departamentos)
  const { gerarRelatorio, gerandoRelatorio } = useRelatorioPdf('DEPARTAMENTOS')

  useEffect(() => { dispatch(carregarDepartamentos(0)) }, [dispatch])

  return <section>
    <PageHeader title="Departamentos" description="Veja os departamentos cadastrados no sistema." createLabel="Novo Departamento" onCreate={() => navigate('/departamentos/novo')} onDownload={gerarRelatorio} downloading={gerandoRelatorio} />
    <div className="card">
      <FilterForm fields={filterFields} values={filters} loading={loading} onChange={(name, value) => dispatch(alterarFiltroDepartamento({ name, value }))} onSubmit={(event) => { event.preventDefault(); dispatch(aplicarFiltrosDepartamento()); dispatch(carregarDepartamentos({ page: 0, filters })) }} />
      <ListError message={error} onRetry={() => dispatch(carregarDepartamentos(page))} onClose={() => dispatch(limparErroDepartamento())} />
      <table><thead><tr><th>Editar</th><th>Excluir</th><th>Código</th><th>Descrição</th></tr></thead>
        <tbody>
          {items.map((item) => <tr key={item.id}><RowActions onEdit={() => navigate(`/departamentos/${item.id}/editar`)} onDelete={() => dispatch(selecionarDepartamento(item))} /><td>{item.codigo}</td><td>{item.descricao}</td></tr>)}
          {items.length === 0 && <tr><td colSpan="4" className="empty">Nenhum departamento encontrado.</td></tr>}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onChange={(newPage) => dispatch(carregarDepartamentos(newPage))} />
    </div>
    {selected && <DeleteModal title="Excluir Departamento" itemLabel={selected.descricao} onClose={() => dispatch(selecionarDepartamento(null))} onConfirm={() => dispatch(excluirDepartamento(selected.id))} />}
  </section>
}

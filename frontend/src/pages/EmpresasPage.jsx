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
import { alterarFiltroEmpresa, aplicarFiltrosEmpresa, carregarEmpresas, excluirEmpresa, limparErroEmpresa, selecionarEmpresa } from '../store/empresasStore'
import { maskCnpj } from '../utils/cnpj'

const fields = [
  { name: 'nome', label: 'Nome', placeholder: 'Procure pelo nome' },
  { name: 'razaoSocial', label: 'Razão Social', placeholder: 'Procure pela razão social' },
  { name: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0000-00', format: maskCnpj },
]

export default function EmpresasPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, filters, selected, page, totalPages, error, loading } = useSelector((state) => state.empresas)
  const { gerarRelatorio, gerandoRelatorio } = useRelatorioPdf('EMPRESAS')
  useEffect(() => { dispatch(carregarEmpresas(0)) }, [dispatch])
  const retry = () => dispatch(carregarEmpresas(page))

  return <section>
    <PageHeader title="Empresas" description="Veja as empresas disponíveis para vínculos." createLabel="Nova Empresa" onCreate={() => navigate('/empresas/nova')} onDownload={gerarRelatorio} downloading={gerandoRelatorio} />
    <div className="card">
      <FilterForm fields={fields} values={filters} loading={loading} className="funcionarios-filters-completo" onChange={(name, value) => dispatch(alterarFiltroEmpresa({ name, value }))} onSubmit={(event) => { event.preventDefault(); dispatch(aplicarFiltrosEmpresa()); dispatch(carregarEmpresas({ page: 0, filters })) }} />
      <ListError message={error} onRetry={retry} onClose={() => dispatch(limparErroEmpresa())} />
      <table><thead><tr><th>Editar</th><th>Excluir</th><th>Nome</th><th>Razão Social</th><th>CNPJ</th></tr></thead><tbody>
        {items.map((item) => <tr key={item.id}><RowActions onEdit={() => navigate(`/empresas/${item.id}/editar`)} onDelete={() => dispatch(selecionarEmpresa(item))} /><td>{item.nome}</td><td>{item.razaoSocial}</td><td>{maskCnpj(item.cnpj)}</td></tr>)}
        {items.length === 0 && !error && <tr><td colSpan="5" className="empty">Nenhuma empresa encontrada.</td></tr>}
      </tbody></table>
      <Pagination page={page} totalPages={totalPages} onChange={(newPage) => dispatch(carregarEmpresas(newPage))} />
    </div>
    {selected && <DeleteModal title="Excluir Empresa" itemLabel={selected.nome} onClose={() => dispatch(selecionarEmpresa(null))} onConfirm={() => dispatch(excluirEmpresa(selected.id))} />}
  </section>
}

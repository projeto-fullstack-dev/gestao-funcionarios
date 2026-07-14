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
import { alterarFiltroCargo, aplicarFiltrosCargo, carregarCargos, excluirCargo, limparErroCargo, selecionarCargo } from '../store/cargosStore'

const filterFields = [
  { name: 'descricao', label: 'Descrição do Cargo', placeholder: 'Procure pelo nome do cargo' },
  { name: 'codigo', label: 'Código', placeholder: 'Procure pelo código do cargo' },
]

export default function CargosPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, filters, selected, page, totalPages, error, loading } = useSelector((state) => state.cargos)
  const { gerarRelatorio, gerandoRelatorio } = useRelatorioPdf('CARGOS')

  useEffect(() => { dispatch(carregarCargos(0)) }, [dispatch])

  return <section>
    <PageHeader title="Cargos" description="Veja os cargos cadastrados no sistema." createLabel="Novo Cargo" onCreate={() => navigate('/cargos/novo')} onDownload={gerarRelatorio} downloading={gerandoRelatorio} />
    <div className="card">
      <FilterForm fields={filterFields} values={filters} loading={loading} onChange={(name, value) => dispatch(alterarFiltroCargo({ name, value }))} onSubmit={(event) => { event.preventDefault(); dispatch(aplicarFiltrosCargo()); dispatch(carregarCargos({ page: 0, filters })) }} />
      <ListError message={error} onRetry={() => dispatch(carregarCargos(page))} onClose={() => dispatch(limparErroCargo())} />
      <table><thead><tr><th>Editar</th><th>Excluir</th><th>Código</th><th>Descrição</th></tr></thead>
        <tbody>
          {items.map((cargo) => <tr key={cargo.id}><RowActions onEdit={() => navigate(`/cargos/${cargo.id}/editar`)} onDelete={() => dispatch(selecionarCargo(cargo))} /><td>{cargo.codigo}</td><td>{cargo.descricao}</td></tr>)}
          {items.length === 0 && <tr><td colSpan="4" className="empty">Nenhum cargo encontrado.</td></tr>}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onChange={(newPage) => dispatch(carregarCargos(newPage))} />
    </div>
    {selected && <DeleteModal title="Excluir Cargo" itemLabel={selected.descricao} onClose={() => dispatch(selecionarCargo(null))} onConfirm={() => dispatch(excluirCargo(selected.id))} />}
  </section>
}

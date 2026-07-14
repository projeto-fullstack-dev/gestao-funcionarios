import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiError } from '../lib/api'
import { departamentoService } from '../services/departamentoService'

export const carregarDepartamentos = createAsyncThunk('departamentos/carregar', async (request, { getState, rejectWithValue }) => {
  try {
    const { appliedFilters, pageSize } = getState().departamentos
    const page = typeof request === 'number' ? request : request?.page ?? 0
    const filters = typeof request === 'object' ? request.filters ?? appliedFilters : appliedFilters
    return await departamentoService.list({ ...filters, page, size: pageSize })
  }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível carregar os departamentos.')) }
})

export const excluirDepartamento = createAsyncThunk('departamentos/excluir', async (id, { dispatch, getState, rejectWithValue }) => {
  try { await departamentoService.remove(id); await dispatch(carregarDepartamentos(getState().departamentos.page)).unwrap() }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível excluir este departamento.')) }
})

const departamentosStore = createSlice({
  name: 'departamentos',
  initialState: { items: [], filters: { descricao: '', codigo: '' }, appliedFilters: { descricao: '', codigo: '' }, page: 0, totalPages: 0, pageSize: 5, selected: null, loading: false, error: null },
  reducers: {
    alterarFiltroDepartamento(state, action) { state.filters[action.payload.name] = action.payload.value },
    aplicarFiltrosDepartamento(state) { state.appliedFilters = { ...state.filters } },
    selecionarDepartamento(state, action) { state.selected = action.payload },
    limparErroDepartamento(state) { state.error = null },
  },
  extraReducers: (builder) => builder
    .addCase(carregarDepartamentos.pending, (state) => { state.loading = true; state.error = null })
    .addCase(carregarDepartamentos.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.content || []; state.page = action.payload.number ?? 0; state.totalPages = action.payload.totalPages ?? 0 })
    .addCase(carregarDepartamentos.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    .addCase(excluirDepartamento.fulfilled, (state) => { state.selected = null })
    .addCase(excluirDepartamento.rejected, (state, action) => { state.selected = null; state.error = action.payload }),
})

export const { alterarFiltroDepartamento, aplicarFiltrosDepartamento, selecionarDepartamento, limparErroDepartamento } = departamentosStore.actions
export default departamentosStore.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiError } from '../lib/api'
import { empresaService } from '../services/empresaService'

export const carregarEmpresas = createAsyncThunk('empresas/carregar', async (request, { getState, rejectWithValue }) => {
  try {
    const { appliedFilters, pageSize } = getState().empresas
    const page = typeof request === 'number' ? request : request?.page ?? 0
    const filters = typeof request === 'object' ? request.filters ?? appliedFilters : appliedFilters
    return await empresaService.list({ ...filters, page, size: pageSize })
  }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível carregar as empresas.')) }
})
export const excluirEmpresa = createAsyncThunk('empresas/excluir', async (id, { dispatch, getState, rejectWithValue }) => {
  try { await empresaService.remove(id); await dispatch(carregarEmpresas(getState().empresas.page)).unwrap() }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível excluir esta empresa.')) }
})
const empresasStore = createSlice({
  name: 'empresas',
  initialState: { items: [], filters: { nome: '', razaoSocial: '', cnpj: '' }, appliedFilters: { nome: '', razaoSocial: '', cnpj: '' }, page: 0, totalPages: 0, pageSize: 5, selected: null, loading: false, error: null },
  reducers: {
    alterarFiltroEmpresa(state, action) { state.filters[action.payload.name] = action.payload.value },
    aplicarFiltrosEmpresa(state) { state.appliedFilters = { ...state.filters } },
    selecionarEmpresa(state, action) { state.selected = action.payload },
    limparErroEmpresa(state) { state.error = null },
  },
  extraReducers: (builder) => builder
    .addCase(carregarEmpresas.pending, (state) => { state.loading = true; state.error = null })
    .addCase(carregarEmpresas.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.content || []; state.page = action.payload.number ?? 0; state.totalPages = action.payload.totalPages ?? 0 })
    .addCase(carregarEmpresas.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    .addCase(excluirEmpresa.fulfilled, (state) => { state.selected = null })
    .addCase(excluirEmpresa.rejected, (state, action) => { state.selected = null; state.error = action.payload }),
})
export const { alterarFiltroEmpresa, aplicarFiltrosEmpresa, selecionarEmpresa, limparErroEmpresa } = empresasStore.actions
export default empresasStore.reducer

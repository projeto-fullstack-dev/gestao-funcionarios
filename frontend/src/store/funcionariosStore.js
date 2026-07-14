import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiError } from '../lib/api'
import { funcionarioService } from '../services/funcionarioService'

export const carregarFuncionarios = createAsyncThunk('funcionarios/carregar', async (request, { getState, rejectWithValue }) => {
  try {
    const { appliedFilters, pageSize } = getState().funcionarios
    const page = typeof request === 'number' ? request : request?.page ?? 0
    const filters = typeof request === 'object' ? request.filters ?? appliedFilters : appliedFilters
    return await funcionarioService.list({ ...filters, page, size: pageSize })
  }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível carregar os funcionários.')) }
})

export const excluirFuncionario = createAsyncThunk('funcionarios/excluir', async (id, { dispatch, getState, rejectWithValue }) => {
  try { await funcionarioService.remove(id); await dispatch(carregarFuncionarios(getState().funcionarios.page)).unwrap() }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível excluir este funcionário.')) }
})

const funcionariosStore = createSlice({
  name: 'funcionarios',
  initialState: { items: [], filters: { nome: '', cpf: '', matricula: '', empresa: '', cargo: '', departamento: '' }, appliedFilters: { nome: '', cpf: '', matricula: '', empresa: '', cargo: '', departamento: '' }, page: 0, totalPages: 0, pageSize: 5, selected: null, loading: false, error: null },
  reducers: {
    alterarFiltroFuncionario(state, action) { state.filters[action.payload.name] = action.payload.value },
    aplicarFiltrosFuncionario(state) { state.appliedFilters = { ...state.filters } },
    selecionarFuncionario(state, action) { state.selected = action.payload },
    limparErroFuncionario(state) { state.error = null },
  },
  extraReducers: (builder) => builder
    .addCase(carregarFuncionarios.pending, (state) => { state.loading = true; state.error = null })
    .addCase(carregarFuncionarios.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.content || []; state.page = action.payload.number ?? 0; state.totalPages = action.payload.totalPages ?? 0 })
    .addCase(carregarFuncionarios.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    .addCase(excluirFuncionario.fulfilled, (state) => { state.selected = null })
    .addCase(excluirFuncionario.rejected, (state, action) => { state.selected = null; state.error = action.payload }),
})

export const { alterarFiltroFuncionario, aplicarFiltrosFuncionario, selecionarFuncionario, limparErroFuncionario } = funcionariosStore.actions
export default funcionariosStore.reducer

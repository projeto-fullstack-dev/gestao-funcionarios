import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiError } from '../lib/api'
import { cargoService } from '../services/cargoService'

export const carregarCargos = createAsyncThunk('cargos/carregar', async (request, { getState, rejectWithValue }) => {
  try {
    const { appliedFilters, pageSize } = getState().cargos
    const page = typeof request === 'number' ? request : request?.page ?? 0
    const filters = typeof request === 'object' ? request.filters ?? appliedFilters : appliedFilters
    return await cargoService.list({ ...filters, page, size: pageSize })
  } catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível carregar os cargos.')) }
})

export const excluirCargo = createAsyncThunk('cargos/excluir', async (id, { dispatch, getState, rejectWithValue }) => {
  try { await cargoService.remove(id); await dispatch(carregarCargos(getState().cargos.page)).unwrap() }
  catch (error) { return rejectWithValue(getApiError(error, 'Não foi possível excluir este cargo.')) }
})

const cargosStore = createSlice({
  name: 'cargos',
  initialState: { items: [], filters: { descricao: '', codigo: '' }, appliedFilters: { descricao: '', codigo: '' }, page: 0, totalPages: 0, pageSize: 5, selected: null, loading: false, error: null },
  reducers: {
    alterarFiltroCargo(state, action) { state.filters[action.payload.name] = action.payload.value },
    aplicarFiltrosCargo(state) { state.appliedFilters = { ...state.filters } },
    selecionarCargo(state, action) { state.selected = action.payload },
    limparErroCargo(state) { state.error = null },
  },
  extraReducers: (builder) => builder
    .addCase(carregarCargos.pending, (state) => { state.loading = true; state.error = null })
    .addCase(carregarCargos.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.content || []; state.page = action.payload.number ?? 0; state.totalPages = action.payload.totalPages ?? 0 })
    .addCase(carregarCargos.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    .addCase(excluirCargo.fulfilled, (state) => { state.selected = null })
    .addCase(excluirCargo.rejected, (state, action) => { state.selected = null; state.error = action.payload }),
})

export const { alterarFiltroCargo, aplicarFiltrosCargo, selecionarCargo, limparErroCargo } = cargosStore.actions
export default cargosStore.reducer

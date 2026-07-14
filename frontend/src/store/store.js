import { configureStore } from '@reduxjs/toolkit'
import cargosReducer from './cargosStore'
import departamentosReducer from './departamentosStore'
import funcionariosReducer from './funcionariosStore'
import empresasReducer from './empresasStore'

export const store = configureStore({ reducer: { cargos: cargosReducer, departamentos: departamentosReducer, funcionarios: funcionariosReducer, empresas: empresasReducer } })

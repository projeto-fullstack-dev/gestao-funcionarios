import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CargoFormPage from './pages/CargoFormPage'
import CargosPage from './pages/CargosPage'
import DepartamentoFormPage from './pages/DepartamentoFormPage'
import DepartamentosPage from './pages/DepartamentosPage'
import FuncionarioFormPage from './pages/FuncionarioFormPage'
import FuncionariosPage from './pages/FuncionariosPage'

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/funcionarios" />} />

          <Route path="/funcionarios" element={<FuncionariosPage />} />
          <Route path="/funcionarios/novo" element={<FuncionarioFormPage />} />
          <Route path="/funcionarios/:id/editar" element={<FuncionarioFormPage />} />

          <Route path="/cargos" element={<CargosPage />} />
          <Route path="/cargos/novo" element={<CargoFormPage />} />
          <Route path="/cargos/:id/editar" element={<CargoFormPage />} />

          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/departamentos/novo" element={<DepartamentoFormPage />} />
          <Route path="/departamentos/:id/editar" element={<DepartamentoFormPage />} />

          <Route path="*" element={<Navigate to="/funcionarios" />} />
        </Routes>
      </main>
    </div>
  )
}
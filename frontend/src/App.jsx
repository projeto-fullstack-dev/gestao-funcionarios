import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './animations.css'
import ProtectedLayout from './components/ProtectedLayout'
import CargoFormPage from './pages/CargoFormPage'
import CargosPage from './pages/CargosPage'
import DepartamentoFormPage from './pages/DepartamentoFormPage'
import DepartamentosPage from './pages/DepartamentosPage'
import FuncionarioFormPage from './pages/FuncionarioFormPage'
import FuncionariosPage from './pages/FuncionariosPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import EmpresaFormPage from './pages/EmpresaFormPage'
import EmpresasPage from './pages/EmpresasPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/funcionarios" replace />} />

          <Route path="/funcionarios" element={<FuncionariosPage />} />
          <Route path="/funcionarios/novo" element={<FuncionarioFormPage />} />
          <Route path="/funcionarios/:id/editar" element={<FuncionarioFormPage />} />

          <Route path="/cargos" element={<CargosPage />} />
          <Route path="/cargos/novo" element={<CargoFormPage />} />
          <Route path="/cargos/:id/editar" element={<CargoFormPage />} />

          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/departamentos/novo" element={<DepartamentoFormPage />} />
          <Route path="/departamentos/:id/editar" element={<DepartamentoFormPage />} />
          <Route path="/empresas" element={<EmpresasPage />} />
          <Route path="/empresas/nova" element={<EmpresaFormPage />} />
          <Route path="/empresas/:id/editar" element={<EmpresaFormPage />} />

          <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

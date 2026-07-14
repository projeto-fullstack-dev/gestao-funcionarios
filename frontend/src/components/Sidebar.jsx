import { Building, Building2, IdCard, LogOut, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import './Sidebar.css'

export default function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="logo">X</div>

      <nav className="menu">
        <NavLink to="/empresas" className="menu-item">
          <Building size={34} />
          <span>Empresa</span>
        </NavLink>

        <NavLink to="/funcionarios" className="menu-item">
          <Users size={34} />
          <span>Funcionário</span>
        </NavLink>

        <NavLink to="/cargos" className="menu-item">
          <IdCard size={34} />
          <span>Cargo</span>
        </NavLink>

        <NavLink to="/departamentos" className="menu-item">
          <Building2 size={34} />
          <span>Departamento</span>
        </NavLink>
      </nav>
      <button className="logout-button" onClick={logout} title="Sair"><LogOut size={24} /><span>Sair</span></button>
    </aside>
  )
}

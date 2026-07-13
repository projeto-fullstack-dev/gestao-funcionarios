import { Building2, IdCard, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">X</div>

      <nav className="menu">
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
    </aside>
  )
}
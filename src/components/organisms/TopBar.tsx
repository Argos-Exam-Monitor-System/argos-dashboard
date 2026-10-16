import { Link, NavLink } from 'react-router-dom'
import argosLogo from '@/assets/argos.svg'
import { TopBarProfile } from '@/components/molecules/TopBarProfile'
import { dashboardLinks } from '@/routes/dashboard'

export function TopBar() {
  return (
    <header className="topbar">
      <nav className="container topbar-inner" aria-label="Navegação principal">
        <Link className="brand" to="/sessoes/ao-vivo">
          <img src={argosLogo} alt="ARGOS, ir para a sessão ao vivo" />
        </Link>
        <div className="topbar-links">
          {dashboardLinks.map(({ path, label }) => (
            <NavLink key={path} to={path} end>
              {label}
            </NavLink>
          ))}
        </div>
        <TopBarProfile />
      </nav>
    </header>
  )
}

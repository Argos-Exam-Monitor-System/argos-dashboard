import { Link } from 'react-router-dom'
import { Avatar } from '@/components/atoms/Avatar'

export function TopBarProfile() {
  return (
    <div className="topbar-profile" role="group" aria-label="Perfil de demonstração">
      <span className="profile-identity">
        <span>Helena Duarte</span>
        <span className="profile-role">Aplicadora</span>
      </span>
      <Avatar initials="HD" />
      <Link className="profile-exit" to="/login">
        Sair
      </Link>
    </div>
  )
}

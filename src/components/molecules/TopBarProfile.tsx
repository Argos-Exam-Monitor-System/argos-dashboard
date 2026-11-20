import { Avatar } from '@/components/atoms/Avatar'
import { session } from '@/features/auth/session'

export function TopBarProfile() {
  return (
    <div className="topbar-profile" role="group" aria-label="Perfil de demonstração">
      <span className="profile-identity">
        <span>Helena Duarte</span>
        <span className="profile-role">Aplicadora</span>
      </span>
      <Avatar initials="HD" />
      <button className="profile-exit" type="button" onClick={() => void session.logout()}>
        Sair
      </button>
    </div>
  )
}

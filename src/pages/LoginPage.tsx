import { Navigate } from 'react-router-dom'
import { EstadoConsulta } from '@/components/EstadoConsulta'
import { session, sessionPath, type SessionStatus, useSessionStatus } from '@/features/auth/session'

const errors: Partial<Record<SessionStatus, string>> = {
  expired: 'Sua sessão expirou. Entre novamente para continuar.',
  unavailable: 'Não foi possível conectar ao Keycloak. Tente novamente.',
  'sign-in-error': 'Não foi possível abrir o login do Keycloak. Tente novamente.',
  'sign-out-error': 'Não foi possível encerrar a sessão no Keycloak. Tente novamente.',
}

const retryLabels: Partial<Record<SessionStatus, string>> = {
  unavailable: 'Tentar novamente',
  'sign-in-error': 'Tentar novamente',
  'sign-out-error': 'Tentar sair novamente',
}

export function LoginPage() {
  const status = useSessionStatus()

  if (status === 'authenticated') return <Navigate to={sessionPath} replace />

  const isSigningOut = status === 'signing-out'
  const isSigningIn = status === 'signing-in'
  const error = errors[status]

  function handleAction() {
    if (status === 'unavailable') window.location.reload()
    else if (status === 'sign-out-error') void session.logout()
    else void session.login()
  }

  return (
    <main className="login-layout">
      <title>Entrar | ARGOS Dashboard</title>
      <div className="login-content">
        <h1>Entrar</h1>
        {error && <EstadoConsulta estado="erro" mensagem={error} />}
        {isSigningIn && <EstadoConsulta estado="carregando" mensagem="Abrindo o Keycloak…" />}
        {isSigningOut ? (
          <EstadoConsulta estado="carregando" mensagem="Encerrando sessão…" />
        ) : (
          <button
            className="login-action"
            type="button"
            disabled={isSigningIn}
            onClick={handleAction}
          >
            {retryLabels[status] ?? 'Entrar'}
          </button>
        )}
      </div>
    </main>
  )
}

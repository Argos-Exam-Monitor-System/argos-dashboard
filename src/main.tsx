import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { EstadoConsulta } from '@/components/EstadoConsulta'
import { session, sessionPath } from '@/features/auth/session'
import { routes } from '@/routes'

async function startDashboard() {
  const root = createRoot(document.getElementById('root')!)
  root.render(
    <main className="login-layout">
      <div className="login-content">
        <EstadoConsulta estado="carregando" mensagem="Verificando sessão…" />
      </div>
    </main>,
  )

  // O adaptador processa e remove o retorno OIDC antes de o roteador ler a URL.
  await session.initialize()
  window.addEventListener('pageshow', (event) => {
    // Uma página restaurada pelo histórico pode conter uma sessão já encerrada.
    if (event.persisted) window.location.reload()
  })
  root.render(
    <StrictMode>
      <RouterProvider router={createBrowserRouter(routes)} />
    </StrictMode>,
  )
}

const callback = new URLSearchParams(window.location.hash.slice(1))
if (
  window.parent !== window &&
  window.location.pathname === sessionPath &&
  callback.has('state') &&
  (callback.has('code') || callback.has('error'))
) {
  // A verificação silenciosa usa o mesmo retorno cadastrado para o login.
  window.parent.postMessage(window.location.href, window.location.origin)
} else {
  void startDashboard()
}

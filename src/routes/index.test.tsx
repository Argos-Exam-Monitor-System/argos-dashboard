import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/routes'
import { session, useSessionStatus } from '@/features/auth/session'

vi.mock('@/features/auth/session', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/auth/session')>()
  return { ...original, useSessionStatus: vi.fn(), session: { login: vi.fn(), logout: vi.fn() } }
})

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('Navegação do dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSessionStatus).mockReturnValue('authenticated')
  })

  it('redireciona a raiz, mantém a ordem dos links e mostra o perfil', async () => {
    const router = renderRoute('/')

    expect(await screen.findByRole('heading', { name: 'Minhas sessões' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes')
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      '',
      'Sessões',
      'Sala de espera',
      'Ao vivo',
      'Relatórios',
      'Coordenação',
    ])
    expect(screen.getByRole('link', { current: 'page', name: 'Sessões' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Perfil de demonstração' })).toHaveTextContent(
      'Helena DuarteAplicadoraHD',
    )
  })

  it.each([
    ['Sessões', '/sessoes', 'Minhas sessões'],
    ['Sala de espera', '/sessoes/espera', 'Sala de espera'],
    ['Ao vivo', '/sessoes/ao-vivo', 'Sessão ao vivo'],
    ['Relatórios', '/relatorios', 'Relatórios'],
    ['Coordenação', '/coordenacao', 'Histórico institucional'],
  ])('abre %s e destaca somente o destino ativo', async (name, path, title) => {
    const user = userEvent.setup()
    const router = renderRoute('/acesso-negado')

    await user.click(screen.getByRole('link', { name }))

    expect(await screen.findByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(path)
    expect(screen.getAllByRole('link', { current: 'page' })).toEqual([
      screen.getByRole('link', { name }),
    ])
    const main = screen.getByRole('main')
    expect(main).toHaveTextContent(new RegExp(`^${title}$`))
    expect(main).toHaveFocus()
  })

  it('permite ir a Ao vivo pela marca e aciona o logout pelo perfil', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/sessoes')

    await user.click(screen.getByRole('link', { name: /argos/i }))
    expect(await screen.findByRole('heading', { name: 'Sessão ao vivo' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes/ao-vivo')

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(session.logout).toHaveBeenCalledOnce()
  })

  it('redireciona o endereço antigo da prévia para Ao vivo', async () => {
    const router = renderRoute('/sessoes/previa')

    expect(await screen.findByRole('heading', { name: 'Sessão ao vivo' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes/ao-vivo')
  })

  it('abre Acesso negado sem destacar um item no menu', async () => {
    renderRoute('/acesso-negado')

    expect(screen.getByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByRole('link', { current: 'page' })).not.toBeInTheDocument()
  })

  it('protege o acesso direto e oferece o login do Keycloak', async () => {
    vi.mocked(useSessionStatus).mockReturnValue('anonymous')
    const user = userEvent.setup()
    const router = renderRoute('/sessoes/espera')

    await user.click(await screen.findByRole('button', { name: 'Entrar' }))
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(session.login).toHaveBeenCalledOnce()
  })

  it('redireciona para Sessões ao abrir o login com autenticação', async () => {
    const router = renderRoute('/login')

    expect(await screen.findByRole('heading', { name: 'Minhas sessões' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes')
  })

  it('volta ao login com uma mensagem quando a sessão expira', async () => {
    vi.mocked(useSessionStatus).mockReturnValue('expired')
    const router = renderRoute('/relatorios')

    expect(await screen.findByRole('alert')).toHaveTextContent('Sua sessão expirou.')
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

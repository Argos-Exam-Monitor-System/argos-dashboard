import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'

describe('Navegação do dashboard', () => {
  it('redireciona a raiz, mantém a ordem dos links e mostra o perfil', async () => {
    await router.navigate('/')
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Minhas sessões' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes')
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      '',
      'Sessões',
      'Sala de espera',
      'Ao vivo',
      'Relatórios',
      'Coordenação',
      'Sair',
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
    await router.navigate('/acesso-negado')
    const user = userEvent.setup()
    render(<RouterProvider router={router} />)

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

  it('abre a tela Entrar pelo perfil e permite ir a Ao vivo pela marca', async () => {
    await router.navigate('/sessoes')
    const user = userEvent.setup()
    render(<RouterProvider router={router} />)

    await user.click(screen.getByRole('link', { name: /argos/i }))
    expect(await screen.findByRole('heading', { name: 'Sessão ao vivo' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes/ao-vivo')

    await user.click(screen.getByRole('link', { name: 'Sair' }))
    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByRole('main')).toHaveTextContent(/^Entrar$/)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('redireciona o endereço antigo da prévia para Ao vivo', async () => {
    await router.navigate('/sessoes/previa')
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Sessão ao vivo' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sessoes/ao-vivo')
  })

  it('abre Acesso negado sem destacar um item no menu', async () => {
    await router.navigate('/acesso-negado')
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByRole('link', { current: 'page' })).not.toBeInTheDocument()
  })
})

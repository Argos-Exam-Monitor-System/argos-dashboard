import { waitFor } from '@testing-library/react'
import Keycloak from 'keycloak-js'
import { createSession } from '@/features/auth/session'

vi.mock('keycloak-js', () => ({ default: vi.fn() }))

function mockKeycloak(authenticated: boolean) {
  const client = {
    idToken: authenticated ? 'id-token' : undefined,
    init: vi.fn().mockResolvedValue(authenticated),
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    updateToken: vi.fn().mockResolvedValue(true),
    clearToken: vi.fn().mockResolvedValue(undefined),
    onTokenExpired: undefined as (() => void) | undefined,
  }
  vi.mocked(Keycloak).mockImplementation(function () {
    return client as unknown as Keycloak
  })
  return client
}

describe('Sessão do Keycloak', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('configura o fluxo público e abre o login por ação do usuário', async () => {
    const client = mockKeycloak(false)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const session = createSession()

    await session.initialize()
    expect(session.getStatus()).toBe('anonymous')
    const redirectUri = window.location.origin + '/sessoes'
    expect(client.init).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: 'check-sso',
        flow: 'standard',
        pkceMethod: 'S256',
        redirectUri,
        silentCheckSsoRedirectUri: redirectUri,
      }),
    )
    expect(client.login).not.toHaveBeenCalled()

    await session.login()
    expect(client.login).toHaveBeenCalledWith({ prompt: 'login' })
  })

  it('permite tentar abrir o login novamente após indisponibilidade', async () => {
    const client = mockKeycloak(false)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue({ ok: true }),
    )
    const session = createSession()

    await session.initialize()
    await session.login()
    expect(session.getStatus()).toBe('sign-in-error')
    expect(client.login).not.toHaveBeenCalled()

    await session.login()
    expect(client.login).toHaveBeenCalledOnce()
  })

  it('encerra a sessão no Keycloak antes de apagar os tokens em memória', async () => {
    const client = mockKeycloak(true)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const session = createSession()

    await session.initialize()
    await session.logout()

    expect(session.getStatus()).toBe('signing-out')
    expect(client.logout).toHaveBeenCalledWith({
      logoutMethod: 'POST',
      redirectUri: window.location.origin + '/login',
    })
    expect(client.logout).toHaveBeenCalledBefore(client.clearToken)
  })

  it('renova ao expirar e limpa a sessão em caso de falha', async () => {
    const client = mockKeycloak(true)
    const session = createSession()
    await session.initialize()

    client.onTokenExpired?.()
    expect(client.updateToken).toHaveBeenCalledWith(-1)
    expect(session.getStatus()).toBe('authenticated')

    client.updateToken.mockRejectedValueOnce(new Error())
    client.onTokenExpired?.()
    await waitFor(() => expect(session.getStatus()).toBe('expired'))
    expect(client.clearToken).toHaveBeenCalledOnce()
  })
})

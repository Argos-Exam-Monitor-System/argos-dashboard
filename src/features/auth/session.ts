import { useSyncExternalStore } from 'react'
import Keycloak from 'keycloak-js'
import { env } from '@/config/env'

export const loginPath = '/login'
export const sessionPath = '/sessoes'

export type SessionStatus =
  | 'checking'
  | 'anonymous'
  | 'authenticated'
  | 'expired'
  | 'unavailable'
  | 'signing-in'
  | 'sign-in-error'
  | 'signing-out'
  | 'sign-out-error'

const timeoutMs = 12_000

async function withTimeout<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('Tempo de resposta do Keycloak excedido.')),
      timeoutMs,
    )
  })

  try {
    return await Promise.race([operation, timeout])
  } finally {
    clearTimeout(timer)
  }
}

async function checkAvailability() {
  const { url, realm } = env.keycloak
  const issuer = `${url.replace(/\/+$/, '')}/realms/${encodeURIComponent(realm)}`
  const response = await fetch(`${issuer}/.well-known/openid-configuration`, {
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) throw new Error('Keycloak indisponível.')
}

export function createSession() {
  let client: Keycloak | undefined
  let status: SessionStatus = 'checking'
  let discardTokens = false
  const listeners = new Set<() => void>()

  function setStatus(next: SessionStatus) {
    status = next
    listeners.forEach((listener) => listener())
  }

  async function renew(keycloak: Keycloak) {
    if (status !== 'authenticated') return

    try {
      await withTimeout(keycloak.updateToken(-1))
    } catch {
      if (status !== 'authenticated') return

      discardTokens = true
      await keycloak.clearToken()
      setStatus('expired')
    }
  }

  async function initialize() {
    try {
      const keycloak = new Keycloak(env.keycloak)
      client = keycloak
      const redirectUri = new URL(sessionPath, window.location.origin).href

      keycloak.onTokenExpired = () => void renew(keycloak)
      const clearLateTokens = () => {
        if (discardTokens) void keycloak.clearToken()
      }
      keycloak.onAuthSuccess = clearLateTokens
      keycloak.onAuthRefreshSuccess = clearLateTokens

      const authenticated = await withTimeout(
        keycloak.init({
          onLoad: 'check-sso',
          flow: 'standard',
          pkceMethod: 'S256',
          responseMode: 'fragment',
          checkLoginIframe: false,
          redirectUri,
          silentCheckSsoRedirectUri: redirectUri,
        }),
      )
      setStatus(authenticated ? 'authenticated' : 'anonymous')
    } catch {
      discardTokens = true
      await client?.clearToken()
      setStatus('unavailable')
    }
  }

  async function login() {
    if (!client || !['anonymous', 'expired', 'sign-in-error'].includes(status)) return

    setStatus('signing-in')
    try {
      await checkAvailability()
      await client.login({ prompt: 'login' })
    } catch {
      setStatus('sign-in-error')
    }
  }

  async function logout() {
    if (!client || (status !== 'authenticated' && status !== 'sign-out-error')) return

    setStatus('signing-out')
    try {
      await checkAvailability()
      await client.logout({
        // O POST mantém o ID token fora da URL. Sem token, o Keycloak pode pedir confirmação.
        logoutMethod: client.idToken ? 'POST' : 'GET',
        redirectUri: new URL(loginPath, window.location.origin).href,
      })
    } catch {
      setStatus('sign-out-error')
    } finally {
      discardTokens = true
      await client.clearToken()
    }
  }

  return {
    initialize,
    login,
    logout,
    getStatus: () => status,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const session = createSession()

export function useSessionStatus() {
  return useSyncExternalStore(session.subscribe, session.getStatus)
}

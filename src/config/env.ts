export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL ?? (import.meta.env.DEV ? 'http://localhost:8080' : ''),
    realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'argos-dev',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'argos-dashboard',
  },
}

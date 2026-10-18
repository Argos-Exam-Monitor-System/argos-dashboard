import { Navigate } from 'react-router-dom'
import { loginPath, useSessionStatus } from '@/features/auth/session'
import { MainLayout } from '@/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage'

export function RequireSession() {
  const status = useSessionStatus()

  if (status === 'authenticated') return <MainLayout />
  if (status === 'signing-out') return <LoginPage />
  return <Navigate to={loginPath} replace />
}

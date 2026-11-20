import { Navigate, type RouteObject } from 'react-router-dom'
import { PageHeading } from '@/components/molecules/PageHeading'
import { loginPath, sessionPath } from '@/features/auth/session'
import { LoginPage } from '@/pages/LoginPage'
import { dashboardLinks } from '@/routes/dashboard'
import { RequireSession } from '@/routes/RequireSession'

export const routes: RouteObject[] = [
  {
    element: <RequireSession />,
    children: [
      { index: true, element: <Navigate to={sessionPath} replace /> },
      ...dashboardLinks.map(({ path, title }) => ({
        path,
        element: <PageHeading title={title} />,
      })),
      { path: 'sessoes/previa', element: <Navigate to="/sessoes/ao-vivo" replace /> },
      { path: 'acesso-negado', element: <PageHeading title="Acesso negado" /> },
    ],
  },
  { path: loginPath, element: <LoginPage /> },
]

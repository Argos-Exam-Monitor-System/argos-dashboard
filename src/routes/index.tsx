import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageHeading } from '@/components/molecules/PageHeading'
import { MainLayout } from '@/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage'
import { dashboardLinks } from '@/routes/dashboard'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/sessoes" replace /> },
      ...dashboardLinks.map(({ path, title }) => ({
        path,
        element: <PageHeading title={title} />,
      })),
      { path: 'sessoes/previa', element: <Navigate to="/sessoes/ao-vivo" replace /> },
      { path: 'acesso-negado', element: <PageHeading title="Acesso negado" /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
])

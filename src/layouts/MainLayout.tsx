import { Outlet } from 'react-router-dom'
import { env } from '@/config/env'

export function MainLayout() {
  return (
    <div>
      <header>{env.appName}</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
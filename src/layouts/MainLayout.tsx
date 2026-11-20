import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from '@/components/organisms/TopBar'
import '@/layouts/MainLayout.css'

export function MainLayout() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (previousPath.current !== pathname && previousPath.current !== '/') {
      mainRef.current?.focus()
    }
    previousPath.current = pathname
  }, [pathname])

  return (
    <>
      <TopBar />
      <main ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}

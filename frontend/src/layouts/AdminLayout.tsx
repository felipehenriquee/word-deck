import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { AccountMenu } from '@/features/auth/components/AccountMenu'
import { useAuthStore } from '@/features/auth/store/authStore'
import { BackLink } from '@/shared/components/BackLink'
import { BrandLogo } from '@/shared/components/BrandLogo'

const navItems = [{ label: 'Usuários', to: '/admin/users' }]

/** Layout da área administrativa (usuários e, depois, o editor de cartas). */
export function AdminLayout() {
  const user = useAuthStore((state) => state.user)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)

  useEffect(() => {
    if (!user) fetchCurrentUser().catch(() => {})
  }, [user, fetchCurrentUser])

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="rounded-full bg-tint px-3 py-1 text-[11px] font-extrabold tracking-[2px] text-link">
              ADMIN
            </span>
          </div>
          <AccountMenu />
        </header>

        <nav aria-label="Admin" className="mt-6 flex flex-wrap items-center gap-2">
          <BackLink to="/" label="Voltar ao app" />
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex h-11 items-center rounded-full px-5 text-[14px] font-bold ${
                  isActive ? 'bg-brand text-white' : 'border border-line bg-white text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/authStore'

/** Botão redondo da conta (degradê da marca) com menu: usuário, admin e sair. */
export function AccountMenu() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const itemClass =
    'flex min-h-11 w-full items-center rounded-[10px] px-3 text-left text-[14px] font-semibold text-ink hover:bg-tint'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Conta"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full bg-brand text-white shadow-glow-brand focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 11 a4 4 0 1 0 0 -8 a4 4 0 0 0 0 8 Z M4 21 Q4 14 12 14 Q20 14 20 21 Z" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute right-0 top-[52px] z-20 w-60 rounded-[14px] bg-white p-2 shadow-lilac ring-1 ring-line"
        >
          {user && (
            <div className="border-b border-line px-3 pb-2 pt-1">
              <p className="truncate text-[14px] font-bold">{user.name}</p>
              <p className="truncate text-[12px] font-medium text-muted">{user.email}</p>
            </div>
          )}
          <nav className="pt-1">
            {user?.role === 'admin' && (
              <Link to="/admin/users" className={itemClass} onClick={() => setOpen(false)}>
                Admin · Usuários
              </Link>
            )}
            <button type="button" className={itemClass} onClick={handleLogout}>
              Sair
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/authStore'
import { usePlayerStore } from '@/features/player/store/playerStore'

/**
 * Layout das telas do jogo (Home, Deck, Loja, Treinar, Coleção): fundo branco
 * e conteúdo centralizado. Cada página monta o próprio topo (AppTopBar), já
 * que a Home mostra a marca e as internas mostram "Voltar".
 */
export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)
  const fetchSummary = usePlayerStore((state) => state.fetchSummary)

  useEffect(() => {
    // Reidrata o usuário após um refresh (o token fica no localStorage).
    if (!user) fetchCurrentUser().catch(() => {})
    fetchSummary()
  }, [user, fetchCurrentUser, fetchSummary])

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:px-6">
        <Outlet />
      </div>
    </div>
  )
}

import { create } from 'zustand'

import { playerService } from '@/features/player/services/playerService'

interface PlayerState {
  points: number | null
  fetchSummary: () => Promise<void>
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  points: null,

  async fetchSummary() {
    if (get().points !== null) return
    try {
      const { points } = await playerService.getSummary()
      set({ points })
    } catch {
      // Sem pontos a pílula mostra "—"; não bloqueia a tela.
    }
  },
}))

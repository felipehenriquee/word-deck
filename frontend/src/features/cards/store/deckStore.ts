import { create } from 'zustand'

import { cardService } from '@/features/cards/services/cardService'
import type { WordCardData } from '@/features/cards/types/card'

interface DeckState {
  cards: WordCardData[]
  loaded: boolean
  loading: boolean
  error: string | null
  /** Carrega o deck uma vez (chamadas seguintes não refazem a busca). */
  fetchDeck: () => Promise<void>
  /** Adiciona cartas ao deck (ex.: ao abrir um booster), sem duplicar ids. */
  addCards: (cards: WordCardData[]) => void
}

export const useDeckStore = create<DeckState>()((set, get) => ({
  cards: [],
  loaded: false,
  loading: false,
  error: null,

  async fetchDeck() {
    if (get().loaded || get().loading) return
    set({ loading: true, error: null })
    try {
      const fetched = await cardService.getDeck()
      // Mantém cartas adicionadas enquanto a busca acontecia (ex.: booster aberto).
      const ids = new Set(fetched.map((c) => c.id))
      set({ cards: [...fetched, ...get().cards.filter((c) => !ids.has(c.id))], loaded: true })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  addCards(newCards) {
    const ids = new Set(get().cards.map((c) => c.id))
    set({ cards: [...get().cards, ...newCards.filter((c) => !ids.has(c.id))] })
  },
}))

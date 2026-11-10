import { MOCK_CARDS } from '@/features/cards/data/mockCards'
import { CARDS_PER_BOOSTER, type WordCardData } from '@/features/cards/types/card'

/**
 * Service da feature "cards".
 *
 * Por enquanto devolve `MOCK_CARDS`. Quando o back-end existir, troque o corpo
 * destas funções por chamadas HTTP (ex.: `http.get('/deck')`, ou uma classe
 * `CardService extends BaseService<WordCardData>` para o CRUD do admin) —
 * as telas e a store só dependem destas assinaturas.
 */
export const cardService = {
  /** Cartas do deck do usuário logado. */
  async getDeck(): Promise<WordCardData[]> {
    return [...MOCK_CARDS]
  },

  /** Todas as cartas existentes (coleção completa). */
  async getCatalog(): Promise<WordCardData[]> {
    return [...MOCK_CARDS]
  },

  /** Sorteia as cartas de um booster. No back-end, o sorteio deve ser feito no servidor. */
  async openBooster(): Promise<WordCardData[]> {
    const pool = [...MOCK_CARDS]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, CARDS_PER_BOOSTER)
  },
}

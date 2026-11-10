export interface PlayerSummary {
  points: number
}

/**
 * Service do jogador (pontos ganhos no treino etc.).
 * Mock até o back-end expor o endpoint — troque por `http.get('/player/me')`.
 */
export const playerService = {
  async getSummary(): Promise<PlayerSummary> {
    return { points: 120 }
  },
}

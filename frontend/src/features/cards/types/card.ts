export type CardType = 'ANIMAL' | 'FAMILY' | 'FOOD' | 'NATURE' | 'PLACE' | 'ACTION'

export interface WordCardData {
  id: string
  word: string
  type: CardType
  /** Pontuação: quão difícil é usar a palavra em uma frase. */
  points: number
  /** Significado em inglês. */
  meaning: string
  /** Frase de exemplo em inglês; a palavra é destacada automaticamente. */
  example: string
  phonetic?: string
  partOfSpeech?: string
  /** Arte 3D estilizada da palavra (PNG/WebP com fundo transparente). */
  imageUrl?: string
  /** Ex.: "012 / 120" */
  number?: string
  setName?: string
  difficulty?: 1 | 2 | 3
}

export const CARD_RATIO = 5 / 7
export const CARDS_PER_BOOSTER = 4

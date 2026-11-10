import type { CardType } from '@/features/cards/types/card'

export interface CardTypeStyle {
  label: string
  /** Path SVG (viewBox 0 0 24 24) usado como ícone do tipo e arte provisória. */
  icon: string
  /** Degradê do tipo (bg-type-*). */
  bgClass: string
  /** Glow da carta cheia (WordCard). */
  glowClass: string
  /** Glow da carta compacta (MiniCard). */
  glowSmClass: string
}

/**
 * Mapa tipo → classes COMPLETAS do Tailwind. As strings precisam aparecer
 * inteiras aqui para o Tailwind gerá-las; nunca concatene `bg-type-${tipo}`.
 * Para criar um tipo novo: adicione em `CardType`, aqui e em `TYPES` no
 * tailwind.config.ts (mantendo o fim do degradê escuro o bastante para texto
 * branco pequeno, contraste ≥ 4.5:1).
 */
export const CARD_TYPES: Record<CardType, CardTypeStyle> = {
  ANIMAL: {
    label: 'ANIMAL',
    icon: 'M5 9 L5 4 L9 7 Q12 6 15 7 L19 4 L19 9 Q21 13 19 16 Q16 20 12 20 Q8 20 5 16 Q3 13 5 9 Z',
    bgClass: 'bg-type-animal',
    glowClass: 'shadow-glow-animal',
    glowSmClass: 'shadow-glow-sm-animal',
  },
  FAMILY: {
    label: 'FAMILY',
    icon: 'M12 11 a4 4 0 1 0 0 -8 a4 4 0 0 0 0 8 Z M4 21 Q4 14 12 14 Q20 14 20 21 Z',
    bgClass: 'bg-type-family',
    glowClass: 'shadow-glow-family',
    glowSmClass: 'shadow-glow-sm-family',
  },
  FOOD: {
    label: 'FOOD',
    icon: 'M12 8 Q8 5 5.5 8 Q3 12 6 17 Q8.5 21 12 19 Q15.5 21 18 17 Q21 12 18.5 8 Q16 5 12 8 Z M12 8 Q12 5 14.5 3',
    bgClass: 'bg-type-food',
    glowClass: 'shadow-glow-food',
    glowSmClass: 'shadow-glow-sm-food',
  },
  NATURE: {
    label: 'NATURE',
    icon: 'M12 3 L5 12 H9 L4 18 H20 L15 12 H19 Z M12 18 V22',
    bgClass: 'bg-type-nature',
    glowClass: 'shadow-glow-nature',
    glowSmClass: 'shadow-glow-sm-nature',
  },
  PLACE: {
    label: 'PLACE',
    icon: 'M3 11 L12 3 L21 11 Z M5 11 V21 H19 V11 Z',
    bgClass: 'bg-type-place',
    glowClass: 'shadow-glow-place',
    glowSmClass: 'shadow-glow-sm-place',
  },
  ACTION: {
    label: 'ACTION',
    icon: 'M13 2 L4 14 H11 L10 22 L20 9 H13 Z',
    bgClass: 'bg-type-action',
    glowClass: 'shadow-glow-action',
    glowSmClass: 'shadow-glow-sm-action',
  },
}

export const CARD_TYPE_LIST = Object.keys(CARD_TYPES) as CardType[]

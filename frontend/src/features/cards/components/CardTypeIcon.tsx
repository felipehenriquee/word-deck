import { CARD_TYPES } from '@/features/cards/constants/cardTypes'
import type { CardType } from '@/features/cards/types/card'

interface CardTypeIconProps {
  type: CardType
  size: number
  /** `solid` = arte provisória branca preenchida; `outline` = ícone da pílula. */
  variant: 'solid' | 'outline'
  className?: string
}

export function CardTypeIcon({ type, size, variant, className }: CardTypeIconProps) {
  const solid = variant === 'solid'
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={solid ? '#FFFFFF' : 'none'}
      stroke={solid ? '#FFFFFF' : 'currentColor'}
      strokeWidth={solid ? 1.4 : 2.2}
      strokeLinejoin="round"
      strokeLinecap={solid ? 'round' : undefined}
    >
      <path d={CARD_TYPES[type].icon} />
    </svg>
  )
}

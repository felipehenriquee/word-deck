import { useId } from 'react'
import { Link } from 'react-router-dom'

import { CardBack } from '@/features/cards/components/CardBack'
import { CARD_TYPES } from '@/features/cards/constants/cardTypes'

const CARD_W = 200

interface DeckStackProps {
  count: number | null
  to?: string
}

/**
 * Deck da Home: pilha de 3 cartas (duas atrás giradas −9° e 7° em degradês de
 * tipo, a da frente é o verso), com dois anéis finos em degradê atrás.
 * A pilha inteira é um link para o deck.
 */
export function DeckStack({ count, to = '/deck' }: DeckStackProps) {
  const gradientId = useId()
  const countLabel = count === null ? '…' : `${count} ${count === 1 ? 'carta' : 'cartas'}`

  return (
    <Link
      to={to}
      aria-label={`Meu deck, ${countLabel}. Abrir deck`}
      className="group relative flex flex-col items-center rounded-[24px] px-6 py-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-link"
    >
      {/* Anéis decorativos */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-[156px] size-[340px] -translate-x-1/2 -translate-y-1/2 sm:size-[400px]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7B3FE4" />
            <stop offset="60%" stopColor="#D6336C" />
            <stop offset="100%" stopColor="#F2603F" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="196"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          opacity="0.35"
        />
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          opacity="0.6"
        />
      </svg>

      <div className="relative h-[280px] w-[200px]">
        <div
          className={`absolute inset-0 -rotate-[9deg] rounded-[14px] transition-transform duration-300 group-hover:-rotate-[13deg] motion-reduce:transition-none ${CARD_TYPES.NATURE.bgClass} ${CARD_TYPES.NATURE.glowSmClass}`}
        />
        <div
          className={`absolute inset-0 rotate-[7deg] rounded-[14px] transition-transform duration-300 group-hover:rotate-[11deg] motion-reduce:transition-none ${CARD_TYPES.FOOD.bgClass} ${CARD_TYPES.FOOD.glowSmClass}`}
        />
        <div className="relative rounded-[11px] shadow-glow-brand transition-transform duration-300 group-hover:-translate-y-1.5 motion-reduce:transition-none">
          <CardBack width={CARD_W} />
        </div>
      </div>

      <span className="relative mt-8 text-[20px] font-extrabold tracking-[4px] text-ink">
        MEU DECK
      </span>
      <span className="relative mt-1 text-[14px] font-semibold text-muted">
        {countLabel} · toque para ver
      </span>
    </Link>
  )
}

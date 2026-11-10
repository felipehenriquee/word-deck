import { MiniCard } from '@/features/cards/components/MiniCard'
import type { WordCardData } from '@/features/cards/types/card'
import { useElementWidth } from '@/hooks/useElementWidth'

const MIN_COL = 170
const MIN_COL_MOBILE = 140

interface CardMosaicProps {
  cards: WordCardData[]
  onSelect: (card: WordCardData) => void
}

/**
 * Mosaico de MiniCards. Equivale a `repeat(auto-fill, minmax(170px, 1fr))` com
 * gap 24 (140px/16 em telas estreitas). As colunas são calculadas a partir da
 * largura medida porque a MiniCard precisa saber a própria largura para escalar.
 */
export function CardMosaic({ cards, onSelect }: CardMosaicProps) {
  const [ref, width] = useElementWidth<HTMLUListElement>()
  const narrow = width > 0 && width < 480
  const gap = narrow ? 16 : 24
  const min = narrow ? MIN_COL_MOBILE : MIN_COL
  const cols = Math.max(1, Math.floor((width + gap) / (min + gap)))
  const cardWidth = width ? Math.min(240, (width - gap * (cols - 1)) / cols) : min

  return (
    <ul
      ref={ref}
      className="grid justify-items-center"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}
    >
      {cards.map((card) => (
        <li key={card.id}>
          <button
            type="button"
            onClick={() => onSelect(card)}
            aria-label={`Ver carta ${card.word}`}
            className="block rounded-[14px] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-link motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <MiniCard card={card} width={cardWidth} />
          </button>
        </li>
      ))}
    </ul>
  )
}

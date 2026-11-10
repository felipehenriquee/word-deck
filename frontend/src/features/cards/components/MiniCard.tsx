import type { CSSProperties } from 'react'

import { CardTypeIcon } from '@/features/cards/components/CardTypeIcon'
import { CARD_TYPES } from '@/features/cards/constants/cardTypes'
import type { WordCardData } from '@/features/cards/types/card'

const BASE_W = 200
const BASE_H = 280

export interface MiniCardProps {
  card: WordCardData
  /** Largura final em px; escala mantendo 5:7. */
  width?: number
  className?: string
  /** Só para valores calculados em tempo de execução (ex.: posição no leque do booster). */
  style?: CSSProperties
}

/** Carta compacta para o mosaico do deck, coleção e revelação do booster (base 200×280). */
export function MiniCard({ card, width = BASE_W, className = '', style }: MiniCardProps) {
  const t = CARD_TYPES[card.type]
  const scale = width / BASE_W

  return (
    <div className={className} style={{ width, height: BASE_H * scale, ...style }}>
      <div
        className={`flex h-[280px] w-[200px] origin-top-left flex-col gap-1.5 rounded-[14px] p-2.5 text-ink ${t.bgClass} ${t.glowSmClass}`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-[10px] bg-white px-[9px] py-1 text-[10px] font-extrabold tracking-[1px]">
            {t.label}
          </span>
          <span className="rounded-[10px] bg-white px-[9px] py-0.5 text-[14px] font-extrabold">
            {card.points}
          </span>
        </div>
        <div className="flex grow items-center justify-center">
          <div className="flex size-[130px] items-center justify-center rounded-full bg-white/20">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt="" className="size-[112px] object-contain" />
            ) : (
              <CardTypeIcon type={card.type} size={82} variant="solid" />
            )}
          </div>
        </div>
        <div
          className={`overflow-hidden whitespace-nowrap text-center font-bold uppercase leading-[38px] tracking-[3px] text-white ${
            card.word.length > 8 ? 'text-[17px]' : 'text-[24px]'
          }`}
        >
          {card.word}
        </div>
      </div>
    </div>
  )
}

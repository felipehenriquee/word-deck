import type { ReactNode } from 'react'

import { CardTypeIcon } from '@/features/cards/components/CardTypeIcon'
import { CARD_TYPES } from '@/features/cards/constants/cardTypes'
import type { WordCardData } from '@/features/cards/types/card'

const BASE_W = 360
const BASE_H = 504

/** Destaca a palavra da carta dentro da frase de exemplo. */
function highlight(example: string, word: string): ReactNode {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = example.split(new RegExp(`(${escaped})`, 'i'))
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <strong key={i} className="font-extrabold not-italic text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export interface WordCardProps {
  card: WordCardData
  /** Largura final em px; a carta escala mantendo a proporção 5:7. */
  width?: number
}

/** Frente da carta em tamanho cheio (base 360×504). */
export function WordCard({ card, width = BASE_W }: WordCardProps) {
  const t = CARD_TYPES[card.type]
  const scale = width / BASE_W
  const difficulty = card.difficulty ?? 1

  return (
    <div style={{ width, height: BASE_H * scale }}>
      <article
        aria-label={`${card.word}, ${t.label}, ${card.points} points`}
        className={`flex h-[504px] w-[360px] origin-top-left flex-col gap-3 rounded-[20px] p-4 text-ink ${t.bgClass} ${t.glowClass}`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* Topo: tipo + pontuação */}
        <div className="flex h-9 items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-[18px] bg-white py-1.5 pl-[9px] pr-3">
            <CardTypeIcon type={card.type} size={18} variant="outline" />
            <span className="text-[11px] font-extrabold tracking-[1.4px]">{t.label}</span>
          </div>
          <div className="flex items-baseline gap-1 rounded-[18px] bg-white px-3.5 py-0.5">
            <span className="text-[22px] font-extrabold leading-8">{card.points}</span>
            <span className="text-[11px] font-extrabold tracking-[1px]">PTS</span>
          </div>
        </div>

        {/* Arte */}
        <div className="relative flex h-[180px] items-center justify-center">
          <div className="absolute size-[172px] rounded-full bg-white/[0.16]" />
          <div className="absolute h-[100px] w-[128px] -translate-y-[22px] translate-x-[42px] rounded-full bg-white/[0.14]" />
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.word}
              className="relative max-h-full max-w-[86%] object-contain"
            />
          ) : (
            <CardTypeIcon type={card.type} size={110} variant="solid" className="relative" />
          )}
        </div>

        {/* Palavra */}
        <div className="flex h-14 items-center justify-center">
          <span
            className={`font-bold uppercase leading-[50px] tracking-[4px] text-white ${
              card.word.length > 8 ? 'text-[30px]' : 'text-[42px]'
            }`}
          >
            {card.word}
          </span>
        </div>

        {/* Significado + frase */}
        <div className="flex h-[132px] flex-col justify-center gap-1.5 overflow-hidden rounded-[14px] bg-white px-4 py-3">
          {(card.phonetic || card.partOfSpeech) && (
            <span className="text-[12px] font-bold uppercase leading-4 tracking-[0.5px] text-muted">
              {[card.phonetic, card.partOfSpeech].filter(Boolean).join(' · ')}
            </span>
          )}
          <p className="text-[13px] font-semibold leading-[17px]">{card.meaning}</p>
          <p className="text-[13px] font-medium italic leading-[17px] text-soft">
            “{highlight(card.example, card.word)}”
          </p>
        </div>

        {/* Rodapé */}
        <div className="flex h-5 items-center justify-between px-1 text-[11px] font-bold tracking-[1px] text-white">
          <span>{card.number ?? ''}</span>
          <div
            role="img"
            aria-label={`Dificuldade ${difficulty} de 3`}
            className="flex items-center gap-1"
          >
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`size-[9px] rounded-full border-2 border-white ${
                  n <= difficulty ? 'bg-white' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <span className="uppercase">{card.setName ?? ''}</span>
        </div>
      </article>
    </div>
  )
}

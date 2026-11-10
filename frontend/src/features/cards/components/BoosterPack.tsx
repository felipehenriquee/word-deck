import { useState } from 'react'

import { MiniCard } from '@/features/cards/components/MiniCard'
import { CARDS_PER_BOOSTER, type WordCardData } from '@/features/cards/types/card'
import { useElementWidth } from '@/hooks/useElementWidth'
import { BRAND_NAME } from '@/shared/brand'

const STAGE_W = 520
const STAGE_H = 760

/** Posição final de cada uma das 4 cartas no leque (x em px, rotação em graus). */
const FAN = [
  { x: -165, r: -10 },
  { x: -55, r: -3 },
  { x: 55, r: 3 },
  { x: 165, r: 10 },
]

export interface BoosterPackProps {
  /** As 4 cartas que saem do booster. */
  cards: WordCardData[]
  setName?: string
  /** Disparado quando o usuário rasga o booster. */
  onOpen?: () => void
  /** Mostra o botão para fechar e abrir de novo depois de rasgado. */
  allowReset?: boolean
  /** Substitui o "fechar" padrão (ex.: a loja troca por um booster novo). */
  onReset?: () => void
  resetLabel?: string
}

/**
 * Booster com efeito de rasgar: a tira de cima se solta, a borda fica serrilhada
 * e as cartas sobem em leque. Palco de 520×760 que escala para caber na largura
 * disponível.
 */
export function BoosterPack({
  cards,
  setName = 'Everyday Words',
  onOpen,
  allowReset = false,
  onReset,
  resetLabel = 'Fechar e abrir de novo',
}: BoosterPackProps) {
  const [opened, setOpened] = useState(false)
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>()
  const scale = containerWidth ? Math.min(1, containerWidth / STAGE_W) : 1

  const open = () => {
    if (opened) return
    setOpened(true)
    onOpen?.()
  }

  const reset = () => (onReset ? onReset() : setOpened(false))

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[520px]"
      style={{ height: STAGE_H * scale }}
    >
      <div
        className="relative h-[760px] w-[520px] origin-top-left overflow-hidden bg-white text-ink"
        style={{ transform: `scale(${scale})` }}
      >
        {cards.slice(0, FAN.length).map((card, i) => (
          <MiniCard
            key={card.id}
            card={card}
            width={150}
            className="absolute left-[185px] top-[300px] z-[1] transition-transform duration-700 ease-pop motion-reduce:transition-none"
            style={{
              transform: opened
                ? `translate(${FAN[i].x}px, -270px) rotate(${FAN[i].r}deg)`
                : 'translate(0px, 0px) rotate(0deg)',
              transitionDelay: `${opened ? 0.45 + i * 0.12 : 0}s`,
            }}
          />
        ))}

        <button
          type="button"
          onClick={open}
          disabled={opened}
          aria-label="Abrir booster"
          className={`absolute left-[110px] top-[260px] z-[2] h-[460px] w-[300px] text-left drop-shadow-booster focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-link ${
            opened ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          {/* Tira de cima: é ela que rasga e voa */}
          <div
            className={`absolute left-0 top-0 h-[34px] w-[300px] origin-bottom-left rounded-t-[4px] bg-brand-purple bg-crimp transition-[transform,opacity] duration-[600ms] ease-in motion-reduce:transition-none ${
              opened
                ? '-translate-y-[150px] translate-x-[70px] rotate-[28deg] opacity-0'
                : 'opacity-100'
            }`}
          />

          {/* Corpo */}
          <div className="absolute left-0 top-[34px] flex h-[392px] w-[300px] flex-col items-center justify-between overflow-hidden bg-booster p-[22px]">
            <svg
              aria-hidden="true"
              width="300"
              height="392"
              viewBox="0 0 300 392"
              className="absolute left-0 top-0"
            >
              <circle cx="30" cy="40" r="90" fill="#FFFFFF" opacity="0.10" />
              <circle cx="150" cy="200" r="104" fill="#FFFFFF" opacity="0.13" />
              <circle cx="290" cy="360" r="110" fill="#FFFFFF" opacity="0.10" />
              <circle cx="252" cy="96" r="5" fill="#FFFFFF" opacity="0.6" />
              <circle cx="44" cy="286" r="4" fill="#FFFFFF" opacity="0.6" />
            </svg>

            {/* Borda serrilhada que aparece depois do rasgo (mesma cor do fundo da página) */}
            <svg
              aria-hidden="true"
              width="300"
              height="14"
              viewBox="0 0 300 14"
              preserveAspectRatio="none"
              className={`absolute -top-px left-0 fill-white transition-opacity delay-[250ms] duration-200 ease-linear motion-reduce:transition-none ${
                opened ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <path d="M0 0 H300 V4 L285 12 L270 3 L252 13 L236 5 L218 12 L200 2 L184 11 L166 4 L150 13 L132 3 L114 12 L98 5 L80 13 L62 2 L46 11 L28 4 L12 12 L0 5 Z" />
            </svg>

            <div className="relative mt-2 flex flex-col items-center gap-1">
              <span className="text-[34px] font-extrabold leading-10 tracking-[4px] text-white">
                {BRAND_NAME}
              </span>
              <span className="text-[12px] font-extrabold tracking-[3px] text-white">
                BOOSTER PACK
              </span>
            </div>

            <svg
              aria-hidden="true"
              width="190"
              height="170"
              viewBox="0 0 190 170"
              className="relative"
            >
              <rect
                x="26"
                y="34"
                width="84"
                height="118"
                rx="10"
                fill="#FFFFFF"
                opacity="0.35"
                transform="rotate(-14 68 93)"
              />
              <rect
                x="80"
                y="34"
                width="84"
                height="118"
                rx="10"
                fill="#FFFFFF"
                opacity="0.35"
                transform="rotate(14 122 93)"
              />
              <rect x="53" y="22" width="84" height="118" rx="10" fill="#FFFFFF" />
              <path
                d="M78 58 L84 96 L95 72 L106 96 L112 58"
                fill="none"
                stroke="#7B3FE4"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative mb-1 flex flex-col items-center gap-2.5">
              <span className="text-[22px] font-bold leading-[26px] tracking-[1px] text-white">
                {setName}
              </span>
              <span className="rounded-[14px] bg-white px-3.5 py-[5px] text-[12px] font-extrabold tracking-[1.5px] text-ink">
                {CARDS_PER_BOOSTER} CARDS
              </span>
            </div>
          </div>

          {/* Tira de baixo */}
          <div className="absolute left-0 top-[426px] h-[34px] w-[300px] rounded-b-[4px] bg-brand-orange bg-crimp" />
        </button>

        <div className="absolute left-0 top-[728px] z-[3] flex w-[520px] justify-center">
          {!opened && (
            <span className="text-[14px] font-semibold text-muted">
              Clique no booster para rasgar
            </span>
          )}
          {opened && allowReset && (
            <button
              type="button"
              onClick={reset}
              className="min-h-8 px-2 text-[14px] font-bold text-link underline"
            >
              {resetLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

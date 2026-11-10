import { BRAND_NAME } from '@/shared/brand'

const BASE_W = 360
const BASE_H = 504

/** Tile branco com o "W" — marca usada no verso, no booster e no deck. */
export function BrandMark({ size = 150 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100">
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="20"
        fill="#FFFFFF"
        transform="rotate(-8 50 50)"
      />
      <path
        d="M28 32 L38 68 L50 44 L62 68 L72 32"
        fill="none"
        stroke="#7B3FE4"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-8 50 50)"
      />
    </svg>
  )
}

export interface CardBackProps {
  /** Largura final em px; escala mantendo 5:7. */
  width?: number
}

/** Verso da carta (base 360×504). */
export function CardBack({ width = BASE_W }: CardBackProps) {
  const scale = width / BASE_W
  return (
    <div style={{ width, height: BASE_H * scale }}>
      <div
        className="relative flex h-[504px] w-[360px] origin-top-left flex-col items-center justify-center gap-[26px] overflow-hidden rounded-[20px] bg-brand-full"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          aria-hidden="true"
          width={BASE_W}
          height={BASE_H}
          viewBox="0 0 360 504"
          className="absolute left-0 top-0"
        >
          <circle cx="40" cy="60" r="110" fill="#FFFFFF" opacity="0.10" />
          <circle cx="330" cy="430" r="140" fill="#FFFFFF" opacity="0.10" />
          <circle cx="180" cy="210" r="128" fill="#FFFFFF" opacity="0.12" />
          <circle
            cx="180"
            cy="210"
            r="150"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.45"
          />
          <circle cx="292" cy="92" r="6" fill="#FFFFFF" opacity="0.6" />
          <circle cx="58" cy="360" r="5" fill="#FFFFFF" opacity="0.55" />
          <circle cx="84" cy="150" r="3" fill="#FFFFFF" opacity="0.6" />
        </svg>
        <div className="relative">
          <BrandMark size={150} />
        </div>
        <div className="relative flex flex-col items-center gap-3">
          <span className="text-[38px] font-extrabold leading-[44px] tracking-[5px] text-white">
            {BRAND_NAME}
          </span>
          <span className="rounded-[14px] bg-white px-3.5 py-1.5 text-[11px] font-extrabold tracking-[2px] text-ink">
            ENGLISH VOCABULARY CARDS
          </span>
        </div>
      </div>
    </div>
  )
}

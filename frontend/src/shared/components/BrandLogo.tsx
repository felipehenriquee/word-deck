import { Link } from 'react-router-dom'

import { BrandMark } from '@/features/cards/components/CardBack'
import { BRAND_NAME } from '@/shared/brand'

/** Marca (tile "W" sobre degradê + nome) usada nos cabeçalhos. */
export function BrandLogo({ to = '/' }: { to?: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-11 items-center gap-2 rounded-xl xs:gap-2.5"
      aria-label={`${BRAND_NAME} — início`}
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-brand-full">
        <BrandMark size={34} />
      </span>
      <span className="text-[15px] font-extrabold tracking-[2.5px] text-ink xs:text-[18px] xs:tracking-[4px]">
        {BRAND_NAME}
      </span>
    </Link>
  )
}

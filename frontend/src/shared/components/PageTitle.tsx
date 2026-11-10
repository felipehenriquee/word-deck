import type { ReactNode } from 'react'

/** Título em caixa alta com letter-spacing + subtítulo secundário. */
export function PageTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="text-center">
      <h1 className="text-[28px] font-extrabold uppercase leading-9 tracking-[5px] text-ink sm:text-[32px]">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-[14px] font-semibold text-muted">{subtitle}</p>}
    </div>
  )
}

import type { ReactNode } from 'react'

interface ComingSoonPanelProps {
  icon: ReactNode
  title: string
  description: string
  children?: ReactNode
}

/** Painel branco com sombra lilás para telas cuja lógica ainda não existe. */
export function ComingSoonPanel({ icon, title, description, children }: ComingSoonPanelProps) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-[14px] bg-white px-6 py-10 text-center shadow-lilac ring-1 ring-line/60">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand text-white shadow-glow-brand">
        {icon}
      </span>
      <h2 className="text-[18px] font-extrabold uppercase tracking-[3px]">{title}</h2>
      <p className="max-w-md text-[14px] font-medium leading-6 text-muted">{description}</p>
      <span className="rounded-full bg-tint px-3 py-1 text-[11px] font-extrabold tracking-[2px] text-link">
        EM BREVE
      </span>
      {children}
    </section>
  )
}

import { PillLink } from '@/shared/components/PillButton'

export function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <p className="bg-brand-full bg-clip-text text-[72px] font-extrabold leading-none tracking-[6px] text-transparent">
        404
      </p>
      <p className="text-[15px] font-semibold text-muted">Página não encontrada</p>
      <PillLink to="/" size="md">
        Voltar para o início
      </PillLink>
    </div>
  )
}

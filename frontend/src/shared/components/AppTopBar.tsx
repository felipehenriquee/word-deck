import { AccountMenu } from '@/features/auth/components/AccountMenu'
import { BackLink } from '@/shared/components/BackLink'
import { BrandLogo } from '@/shared/components/BrandLogo'
import { PointsPill } from '@/shared/components/PointsPill'

interface AppTopBarProps {
  /** Mostra "Voltar" no lugar da marca (telas internas). */
  backTo?: string
}

/** Topo das telas do jogo: marca (ou Voltar) à esquerda; pontos e conta à direita. */
export function AppTopBar({ backTo }: AppTopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      {backTo ? <BackLink to={backTo} /> : <BrandLogo />}
      <div className="flex items-center gap-2 xs:gap-3">
        <PointsPill />
        {!backTo && <AccountMenu />}
      </div>
    </header>
  )
}

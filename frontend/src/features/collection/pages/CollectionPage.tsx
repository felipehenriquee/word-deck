import { AppTopBar } from '@/shared/components/AppTopBar'
import { ComingSoonPanel } from '@/shared/components/ComingSoonPanel'
import { PageTitle } from '@/shared/components/PageTitle'
import { PillLink } from '@/shared/components/PillButton'

/** Coleção completa (todas as cartas do jogo, com as que faltam). Lógica vem depois. */
export function CollectionPage() {
  return (
    <>
      <AppTopBar backTo="/" />
      <main className="mt-6 flex flex-col gap-8">
        <PageTitle title="Coleção" subtitle="Todas as cartas do jogo" />
        <ComingSoonPanel
          title="Coleção completa"
          description="Aqui você vai ver todas as cartas de cada set, quais já tem e quais ainda faltam para completar a coleção."
          icon={
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinejoin="round"
            >
              <path d="M4 4 H10 V10 H4 Z M14 4 H20 V10 H14 Z M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z" />
            </svg>
          }
        >
          <PillLink to="/shop" size="md">
            Abrir um booster
          </PillLink>
        </ComingSoonPanel>
      </main>
    </>
  )
}

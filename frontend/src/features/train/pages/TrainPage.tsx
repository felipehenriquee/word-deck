import { AppTopBar } from '@/shared/components/AppTopBar'
import { ComingSoonPanel } from '@/shared/components/ComingSoonPanel'
import { PageTitle } from '@/shared/components/PageTitle'
import { PillLink } from '@/shared/components/PillButton'

/** Treinar: escrever frases com as cartas e ganhar pontos. Lógica vem depois. */
export function TrainPage() {
  return (
    <>
      <AppTopBar backTo="/" />
      <main className="mt-6 flex flex-col gap-8">
        <PageTitle
          title="Treinar"
          subtitle="Use as palavras do seu deck em frases e ganhe pontos"
        />
        <ComingSoonPanel
          title="Modo treino"
          description="Você vai sortear cartas do seu deck e escrever frases em inglês usando cada palavra. Quanto mais difícil a palavra, mais pontos."
          icon={
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20 L8 19 L19 8 L16 5 L5 16 Z M14 7 L17 10" />
            </svg>
          }
        >
          <PillLink to="/deck" variant="secondary" size="md">
            Revisar meu deck
          </PillLink>
        </ComingSoonPanel>
      </main>
    </>
  )
}

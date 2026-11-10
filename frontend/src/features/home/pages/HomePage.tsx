import { useEffect } from 'react'

import { useDeckStore } from '@/features/cards/store/deckStore'
import { DeckStack } from '@/features/home/components/DeckStack'
import { AppTopBar } from '@/shared/components/AppTopBar'
import { PillLink } from '@/shared/components/PillButton'

export function HomePage() {
  const cards = useDeckStore((state) => state.cards)
  const loaded = useDeckStore((state) => state.loaded)
  const fetchDeck = useDeckStore((state) => state.fetchDeck)

  useEffect(() => {
    fetchDeck()
  }, [fetchDeck])

  return (
    <>
      <AppTopBar />

      <main className="mt-10 flex flex-col items-center overflow-x-clip sm:mt-14">
        <DeckStack count={loaded ? cards.length : null} />

        <nav aria-label="Ações" className="mt-10 flex w-full flex-wrap justify-center gap-4">
          <PillLink to="/shop" className="w-full xs:w-auto">
            Loja de boosters
          </PillLink>
          <PillLink to="/train" variant="secondary" className="w-full xs:w-auto">
            Treinar
          </PillLink>
          <PillLink to="/collection" variant="secondary" className="w-full xs:w-auto">
            Coleção
          </PillLink>
        </nav>
      </main>
    </>
  )
}

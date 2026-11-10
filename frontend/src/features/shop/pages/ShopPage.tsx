import { useCallback, useEffect, useState } from 'react'

import { BoosterPack } from '@/features/cards/components/BoosterPack'
import { cardService } from '@/features/cards/services/cardService'
import { useDeckStore } from '@/features/cards/store/deckStore'
import type { WordCardData } from '@/features/cards/types/card'
import { AppTopBar } from '@/shared/components/AppTopBar'
import { PageTitle } from '@/shared/components/PageTitle'
import { PillLink } from '@/shared/components/PillButton'

export function ShopPage() {
  const fetchDeck = useDeckStore((state) => state.fetchDeck)
  const addCards = useDeckStore((state) => state.addCards)

  const [booster, setBooster] = useState<{ key: number; cards: WordCardData[] } | null>(null)
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBooster = useCallback(async () => {
    setError(null)
    setOpened(false)
    try {
      const cards = await cardService.openBooster()
      setBooster((prev) => ({ key: (prev?.key ?? 0) + 1, cards }))
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  useEffect(() => {
    // Garante o deck carregado antes de somar as cartas novas a ele.
    fetchDeck()
    loadBooster()
  }, [fetchDeck, loadBooster])

  function handleOpen() {
    if (!booster) return
    addCards(booster.cards)
    setOpened(true)
  }

  return (
    <>
      <AppTopBar backTo="/" />

      <main className="mt-6 flex flex-col items-center gap-4">
        <PageTitle title="Loja de boosters" subtitle="Rasgue o booster e ganhe 4 cartas novas" />

        {error && (
          <p
            role="alert"
            className="rounded-[14px] bg-tint px-4 py-3 text-center text-[14px] font-semibold"
          >
            Não foi possível carregar o booster: {error}
          </p>
        )}

        {booster && (
          <BoosterPack
            key={booster.key}
            cards={booster.cards}
            onOpen={handleOpen}
            allowReset
            onReset={loadBooster}
            resetLabel="Abrir outro booster"
          />
        )}

        <p aria-live="polite" className="min-h-6 text-center text-[14px] font-semibold text-muted">
          {opened && 'As cartas foram adicionadas ao seu deck.'}
        </p>
        {opened && (
          <PillLink to="/deck" variant="secondary" size="md">
            Ver meu deck
          </PillLink>
        )}
      </main>
    </>
  )
}

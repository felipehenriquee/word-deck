import { useEffect, useMemo, useState } from 'react'

import { WordCard } from '@/features/cards/components/WordCard'
import { useDeckStore } from '@/features/cards/store/deckStore'
import type { CardType, WordCardData } from '@/features/cards/types/card'
import { CardMosaic } from '@/features/deck/components/CardMosaic'
import { TypeFilter } from '@/features/deck/components/TypeFilter'
import { AppTopBar } from '@/shared/components/AppTopBar'
import { Modal } from '@/shared/components/Modal'
import { PageTitle } from '@/shared/components/PageTitle'
import { Pagination } from '@/shared/components/Pagination'
import { PillLink } from '@/shared/components/PillButton'

const PAGE_SIZE = 12

export function DeckPage() {
  const cards = useDeckStore((state) => state.cards)
  const loading = useDeckStore((state) => state.loading)
  const error = useDeckStore((state) => state.error)
  const fetchDeck = useDeckStore((state) => state.fetchDeck)

  const [type, setType] = useState<CardType | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<WordCardData | null>(null)

  useEffect(() => {
    fetchDeck()
  }, [fetchDeck])

  const filtered = useMemo(
    () => (type ? cards.filter((c) => c.type === type) : cards),
    [cards, type],
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageCards = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Carta cheia cabe na largura da tela (16px de respiro de cada lado).
  const fullCardWidth = Math.min(
    360,
    (typeof window === 'undefined' ? 360 : window.innerWidth) - 32,
  )

  function changeType(next: CardType | null) {
    setType(next)
    setPage(1)
  }

  return (
    <>
      <AppTopBar backTo="/" />

      <main className="mt-6 flex flex-col gap-6">
        <PageTitle
          title="Meu deck"
          subtitle={`${filtered.length} ${filtered.length === 1 ? 'carta' : 'cartas'} · página ${currentPage} de ${totalPages}`}
        />

        <TypeFilter value={type} onChange={changeType} />

        {error && (
          <p
            role="alert"
            className="rounded-[14px] bg-tint px-4 py-3 text-center text-[14px] font-semibold text-ink"
          >
            Não foi possível carregar o deck: {error}
          </p>
        )}

        {loading && cards.length === 0 ? (
          <p className="py-16 text-center text-[14px] font-semibold text-muted">
            Carregando cartas…
          </p>
        ) : pageCards.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-[14px] font-semibold text-muted">
              {type ? 'Nenhuma carta deste tipo no seu deck.' : 'Seu deck ainda está vazio.'}
            </p>
            <PillLink to="/shop" size="md">
              Abrir um booster
            </PillLink>
          </div>
        ) : (
          <CardMosaic cards={pageCards} onSelect={setSelected} />
        )}

        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </main>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        label={selected ? `Carta ${selected.word}` : 'Carta'}
      >
        {selected && (
          <div className="flex flex-col items-center gap-4">
            <WordCard card={selected} width={fullCardWidth} />
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-bold text-ink shadow-lilac focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
              Fechar
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}

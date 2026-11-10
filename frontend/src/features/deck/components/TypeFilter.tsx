import { CARD_TYPES, CARD_TYPE_LIST } from '@/features/cards/constants/cardTypes'
import type { CardType } from '@/features/cards/types/card'

interface TypeFilterProps {
  value: CardType | null
  onChange: (type: CardType | null) => void
}

const ACTIVE = 'bg-brand text-white border-transparent'
const INACTIVE = 'bg-white text-ink border-line hover:bg-tint'

/** Chips de filtro por tipo (ativo = degradê da marca; inativo = branco com borda). */
export function TypeFilter({ value, onChange }: TypeFilterProps) {
  const options: { key: CardType | null; label: string }[] = [
    { key: null, label: 'TODAS' },
    ...CARD_TYPE_LIST.map((type) => ({ key: type, label: CARD_TYPES[type].label })),
  ]

  return (
    <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap justify-center gap-2">
      {options.map((opt) => {
        const active = value === opt.key
        return (
          <button
            key={opt.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            className={`h-11 rounded-full border px-4 text-[12px] font-extrabold tracking-[1.5px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-link ${
              active ? ACTIVE : INACTIVE
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

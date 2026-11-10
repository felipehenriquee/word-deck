interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const BTN =
  'flex size-11 items-center justify-center rounded-full text-[14px] font-extrabold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-link disabled:opacity-40'
const CURRENT = 'bg-brand text-white shadow-glow-brand'
const OTHER = 'bg-white text-ink border border-line hover:bg-tint'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === 'left' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'} />
    </svg>
  )
}

/** Paginação com botões redondos de 44px (página atual em degradê). */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${BTN} ${OTHER}`}
      >
        <Chevron dir="left" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-label={`Página ${p}`}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
          className={`${BTN} ${p === page ? CURRENT : OTHER}`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${BTN} ${OTHER}`}
      >
        <Chevron dir="right" />
      </button>
    </nav>
  )
}

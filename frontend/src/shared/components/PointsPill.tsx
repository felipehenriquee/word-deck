import { usePlayerStore } from '@/features/player/store/playerStore'

/** Pílula com os pontos do jogador (superfície suave + estrela roxa). */
export function PointsPill() {
  const points = usePlayerStore((state) => state.points)
  const label = points === null ? '—' : points.toLocaleString('pt-BR')

  return (
    <span
      className="inline-flex h-11 items-center gap-2 rounded-full bg-tint px-4 text-ink"
      aria-label={`Seus pontos: ${label}`}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="fill-link">
        <path d="M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 14 L17.9 20.6 L12 17.3 L6.1 20.6 L7.4 14 L2.5 9.4 L9.1 8.6 Z" />
      </svg>
      <span className="text-[16px] font-extrabold" aria-hidden="true">
        {label}
      </span>
      <span className="text-[11px] font-extrabold tracking-[1px]" aria-hidden="true">
        PTS
      </span>
    </span>
  )
}

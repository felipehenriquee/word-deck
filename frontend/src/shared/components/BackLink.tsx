import { Link } from 'react-router-dom'

export function BackLink({ to = '/', label = 'Voltar' }: { to?: string; label?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-[15px] font-bold text-link hover:underline"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 5 L8 12 L15 19" />
      </svg>
      {label}
    </Link>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary'
type Size = 'lg' | 'md'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-glow-brand',
  secondary: 'bg-white text-ink shadow-lilac',
}

const SIZES: Record<Size, string> = {
  lg: 'h-14 px-8 text-[15px]',
  md: 'h-11 px-6 text-[14px]',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-[0.5px] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-link motion-reduce:transition-none motion-reduce:hover:translate-y-0'

function classes(variant: Variant, size: Size, className = '') {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

/** Botão em pílula (raio = metade da altura). Ações principais em degradê. */
export function PillButton({
  variant = 'primary',
  size = 'lg',
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}

/** Mesmo visual do PillButton, mas como link de navegação. */
export function PillLink({
  to,
  variant = 'primary',
  size = 'lg',
  className,
  children,
}: CommonProps & { to: string }) {
  return (
    <Link to={to} className={classes(variant, size, className)}>
      {children}
    </Link>
  )
}

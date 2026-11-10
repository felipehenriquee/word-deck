import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { CardBack } from '@/features/cards/components/CardBack'
import { useAuthStore } from '@/features/auth/store/authStore'
import { BRAND_NAME } from '@/shared/brand'
import { PillButton } from '@/shared/components/PillButton'
import { TextField } from '@/shared/components/TextField'

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12 Q12 3 22 12 Q12 21 2 12 Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4 L20 20" />}
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)

  const emailInvalid = !/.+@.+\..+/.test(email)
  const passwordInvalid = password.length === 0

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (emailInvalid || passwordInvalid) return

    try {
      await login({ email, password })
      const redirect = (location.state as { redirect?: string } | null)?.redirect ?? '/'
      navigate(redirect, { replace: true })
    } catch {
      // authStore.error já guarda a mensagem; exibida abaixo.
    }
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 py-10 md:flex-row md:gap-16">
      {/* Verso da carta como "capa" da tela (só em telas maiores) */}
      <div className="hidden -rotate-6 md:block" aria-hidden="true">
        <div className="rounded-[20px] shadow-glow-brand">
          <CardBack width={300} />
        </div>
      </div>

      <section className="w-full max-w-sm rounded-[14px] bg-white p-6 shadow-lilac ring-1 ring-line/60 sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-[13px] font-extrabold tracking-[4px] text-link">{BRAND_NAME}</p>
          <h1 className="mt-2 text-[24px] font-extrabold uppercase tracking-[3px]">Entrar</h1>
          <p className="mt-1 text-[14px] font-medium text-muted">
            Continue montando seu deck de palavras
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-[14px] bg-tint px-4 py-3 text-[14px] font-semibold text-ink"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={touched && emailInvalid ? 'Informe um e-mail válido' : undefined}
            autoComplete="email"
          />

          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={touched && passwordInvalid ? 'Campo obrigatório' : undefined}
            autoComplete="current-password"
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                className="mr-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-link"
              >
                <EyeIcon off={showPassword} />
              </button>
            }
          />

          <PillButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </PillButton>
        </form>
      </section>
    </div>
  )
}

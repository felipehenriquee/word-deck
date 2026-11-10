import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Conteúdo à direita dentro do campo (ex.: botão de mostrar senha). */
  endAdornment?: ReactNode
}

/** Campo de texto com label, borda lilás e mensagem de erro acessível. */
export function TextField({
  label,
  error,
  endAdornment,
  className = '',
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-[13px] font-bold text-ink">
        {label}
      </label>
      <div
        className={`flex h-12 items-center rounded-[14px] border-2 bg-white focus-within:border-brand-purple ${
          error ? 'border-brand-pink' : 'border-line'
        }`}
      >
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="h-full min-w-0 flex-1 rounded-[14px] bg-transparent px-4 text-[15px] font-medium text-ink outline-none placeholder:text-muted/70"
          {...rest}
        />
        {endAdornment}
      </div>
      {error && (
        <span id={errorId} className="text-[12px] font-semibold text-brand-pink">
          {error}
        </span>
      )}
    </div>
  )
}

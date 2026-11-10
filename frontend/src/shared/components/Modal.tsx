import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Nome acessível do diálogo. */
  label: string
  className?: string
  children: ReactNode
}

/**
 * Diálogo modal sobre o `<dialog>` nativo (foco preso, Esc fecha, fundo inerte).
 * Clicar no fundo escurecido também fecha.
 */
export function Modal({ open, onClose, label, className = '', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`m-auto max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] overflow-visible bg-transparent text-ink backdrop:bg-ink/50 ${className}`}
    >
      {open && children}
    </dialog>
  )
}

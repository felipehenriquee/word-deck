import { useEffect, useState, type FormEvent } from 'react'

import { Modal } from '@/shared/components/Modal'
import { PillButton } from '@/shared/components/PillButton'
import { TextField } from '@/shared/components/TextField'
import type { CreateUserPayload, User } from '@/features/users/types/user'

const ROLES: User['role'][] = ['admin', 'editor', 'viewer']

const emptyForm: CreateUserPayload = { name: '', email: '', role: 'viewer', active: true }

interface UserFormDialogProps {
  open: boolean
  editingUser: User | null
  onClose: () => void
  onSubmit: (payload: CreateUserPayload) => void
}

export function UserFormDialog({ open, editingUser, onClose, onSubmit }: UserFormDialogProps) {
  const [form, setForm] = useState<CreateUserPayload>(emptyForm)

  useEffect(() => {
    setForm(
      editingUser
        ? {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            active: editingUser.active,
          }
        : emptyForm,
    )
  }, [editingUser, open])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) return
    onSubmit(form)
  }

  const title = editingUser ? 'Editar usuário' : 'Novo usuário'

  return (
    <Modal open={open} onClose={onClose} label={title}>
      <form
        onSubmit={handleSubmit}
        className="flex w-[min(28rem,calc(100vw-32px))] flex-col gap-4 rounded-[14px] bg-white p-6 shadow-lilac"
      >
        <h2 className="text-[18px] font-extrabold uppercase tracking-[3px]">{title}</h2>

        <TextField
          label="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="text-[13px] font-bold">
            Papel
          </label>
          <select
            id="user-role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
            className="h-12 rounded-[14px] border-2 border-line bg-white px-3 text-[15px] font-medium outline-none focus:border-brand-purple"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[14px] font-semibold">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="size-5 accent-brand-purple"
          />
          Ativo
        </label>

        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <PillButton variant="secondary" size="md" onClick={onClose}>
            Cancelar
          </PillButton>
          <PillButton type="submit" size="md">
            Salvar
          </PillButton>
        </div>
      </form>
    </Modal>
  )
}

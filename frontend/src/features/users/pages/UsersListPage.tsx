import { useEffect, useState } from 'react'

import { useUserStore } from '@/features/users/store/userStore'
import { UserFormDialog } from '@/features/users/components/UserFormDialog'
import type { CreateUserPayload, User } from '@/features/users/types/user'
import { PillButton } from '@/shared/components/PillButton'

function IconButton({
  label,
  onClick,
  path,
}: {
  label: string
  onClick: () => void
  path: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-link focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-link"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </button>
  )
}

const EDIT_ICON = 'M4 20 L8 19 L19 8 L16 5 L5 16 Z M14 7 L17 10'
const DELETE_ICON = 'M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 20 H17 L18 7 M10 11 V16 M14 11 V16'

export function UsersListPage() {
  const items = useUserStore((state) => state.items)
  const loading = useUserStore((state) => state.loading)
  const error = useUserStore((state) => state.error)
  const fetchAll = useUserStore((state) => state.fetchAll)
  const create = useUserStore((state) => state.create)
  const update = useUserStore((state) => state.update)
  const remove = useUserStore((state) => state.remove)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  function openCreate() {
    setEditingUser(null)
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setDialogOpen(true)
  }

  async function handleSubmit(payload: CreateUserPayload) {
    if (editingUser) {
      await update(editingUser.id, payload)
    } else {
      await create(payload)
    }
    setDialogOpen(false)
  }

  async function handleDelete(user: User) {
    if (confirm(`Remover ${user.name}?`)) {
      await remove(user.id)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-extrabold uppercase tracking-[3px]">Usuários</h1>
        <PillButton size="md" onClick={openCreate}>
          + Novo usuário
        </PillButton>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-[14px] bg-tint px-4 py-3 text-[14px] font-semibold">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-[14px] bg-white shadow-lilac ring-1 ring-line/60">
        {loading && <div className="h-1 animate-pulse bg-brand motion-reduce:animate-none" />}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-[11px] font-extrabold uppercase tracking-[1.5px] text-muted">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Papel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-line/60 last:border-0 hover:bg-tint/50"
                >
                  <td className="px-4 py-2 font-semibold">{user.name}</td>
                  <td className="px-4 py-2 text-soft">{user.email}</td>
                  <td className="px-4 py-2 text-soft">{user.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[1px] ${
                        user.active ? 'bg-type-animal text-white' : 'bg-tint text-muted'
                      }`}
                    >
                      {user.active ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-right">
                    <IconButton
                      label={`Editar ${user.name}`}
                      onClick={() => openEdit(user)}
                      path={EDIT_ICON}
                    />
                    <IconButton
                      label={`Remover ${user.name}`}
                      onClick={() => handleDelete(user)}
                      path={DELETE_ICON}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && items.length === 0 && (
          <p className="p-6 text-center text-[14px] font-semibold text-muted">
            Nenhum usuário cadastrado.
          </p>
        )}
      </div>

      <UserFormDialog
        open={dialogOpen}
        editingUser={editingUser}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

import { Outlet } from 'react-router-dom'

// Layout para páginas públicas (login, registro, recuperar senha): fundo branco,
// conteúdo centralizado, sem topo do app.
export function AuthLayout() {
  return (
    <div className="min-h-full bg-white">
      <Outlet />
    </div>
  )
}

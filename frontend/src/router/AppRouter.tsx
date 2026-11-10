import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/router/ProtectedRoute'
import { GuestRoute } from '@/router/GuestRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { DeckPage } from '@/features/deck/pages/DeckPage'
import { ShopPage } from '@/features/shop/pages/ShopPage'
import { TrainPage } from '@/features/train/pages/TrainPage'
import { CollectionPage } from '@/features/collection/pages/CollectionPage'
import { UsersListPage } from '@/features/users/pages/UsersListPage'
import { NotFoundPage } from '@/shared/NotFoundPage'

/**
 * Rotas raiz da aplicação. Cada bloco escolhe seu layout e passa pela guarda
 * correspondente (GuestRoute para o login, ProtectedRoute para o resto).
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/deck" element={<DeckPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/collection" element={<CollectionPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UsersListPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

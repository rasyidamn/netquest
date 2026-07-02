import { requireAdmin } from '@/feature/auth/guard/guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminLayout } from './-components/layout/AdminLayout'

export const Route = createFileRoute('/_protected/admin')({
  beforeLoad: ({context}) => requireAdmin({context}),
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
})

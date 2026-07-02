import { requireStudent } from '@/feature/auth/guard/guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from './-components/layout/DashboardLayout'

export const Route = createFileRoute('/_protected/_student')({
  beforeLoad: ({context}) => requireStudent({context}),
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
})



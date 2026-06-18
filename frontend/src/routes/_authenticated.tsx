import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from './-guard'



export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => requireAuth({ context }),
  component: ()=> <Outlet />,
})



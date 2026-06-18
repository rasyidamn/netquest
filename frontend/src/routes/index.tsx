import { useAuthStore } from '@/stores/auth.store';
import { createFileRoute, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isAuthenticated, role } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: "/auth/login" });
    if (role === "ADMIN") throw redirect({ to: "/admin" });
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
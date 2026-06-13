import { useAuthStore } from '@/stores/auth.store';
import { createFileRoute, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { token, user } = useAuthStore.getState();
    if (!token) throw redirect({ to: "/auth/login" });
    if (user?.role === "ADMIN") throw redirect({ to: "/admin" });
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
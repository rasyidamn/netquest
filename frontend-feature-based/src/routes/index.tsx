import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/feature/auth/stores/useAuthStore";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const store = useAuthStore();

	if (!store.isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
	}
	if (store.role === "ADMIN") {
		return <Navigate to="/admin" replace />;
	}
	return <Navigate to="/dashboard" replace />;
}

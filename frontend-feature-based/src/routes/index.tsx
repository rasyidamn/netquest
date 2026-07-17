import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/feature/auth/stores/useAuthStore";
import { LandingPage } from "@/feature/landing/components/LandingPage";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const store = useAuthStore();

	if (!store.isAuthenticated) {
		return <LandingPage />;
	}
	if (store.role === "ADMIN") {
		return <Navigate to="/admin" replace />;
	}
	return <Navigate to="/dashboard" replace />;
}


import { requireGuest } from "@/feature/auth/guard/guard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthLayout } from "./-components/layout/AuthLayout";

export const Route = createFileRoute("/_guest/auth")({
	beforeLoad: ({ context }) => requireGuest({ context }),
	component: () => (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	),
});

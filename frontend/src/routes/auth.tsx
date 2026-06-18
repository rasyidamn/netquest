import { AuthLayout } from "@/components/layouts/AuthLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireGuest } from "./-guard";

export const Route = createFileRoute("/auth")({
	beforeLoad: ({ context }) => requireGuest({ context }),
	component: () => (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	),
});

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	component: () => (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	),
});

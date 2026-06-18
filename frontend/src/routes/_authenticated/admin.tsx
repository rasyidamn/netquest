import { AdminLayout } from "@/components/layouts/AdminLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAdmin } from "../-guard";

export const Route = createFileRoute("/_authenticated/admin")({
	beforeLoad: ({ context }) => requireAdmin({ context }),
	component: () => (
		<AdminLayout>
			<Outlet />
		</AdminLayout>
	),
});

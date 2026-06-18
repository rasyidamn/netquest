import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireMahasiswa } from "../-guard";

export const Route = createFileRoute("/_authenticated/_student")({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: () => (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	),
});

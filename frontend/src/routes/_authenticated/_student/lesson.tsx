import { requireMahasiswa } from "@/routes/-guard";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_student/lesson")({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: () => <Outlet />,
});

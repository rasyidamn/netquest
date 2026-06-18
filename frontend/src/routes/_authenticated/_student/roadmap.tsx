// _authenticated/_student/roadmap.tsx
import { requireMahasiswa } from "@/routes/-guard";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_student/roadmap")({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: () => <Outlet />,
});
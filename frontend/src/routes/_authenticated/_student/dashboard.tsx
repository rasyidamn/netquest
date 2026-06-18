import { createFileRoute } from "@tanstack/react-router";
import { requireMahasiswa } from "../../-guard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardPage } from "@/components/pages/Student/DashboardPage";

export const Route = createFileRoute(
	"/_authenticated/_student/dashboard",
)({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: DashboardPage,
});

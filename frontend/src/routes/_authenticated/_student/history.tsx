import { createFileRoute } from "@tanstack/react-router";
import { requireMahasiswa } from "../../-guard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export const Route = createFileRoute(
	"/_authenticated/_student/history",
)({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: () => (

			<div className="p-6">
				<h1 className="text-2xl font-bold">Riwayat Kuis</h1>
				<p className="text-base-content/60">Riwayat pengerjaan kuis.</p>
			</div>
	),
});

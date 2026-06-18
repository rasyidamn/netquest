import { createFileRoute } from "@tanstack/react-router";
import { requireMahasiswa } from "../../-guard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export const Route = createFileRoute("/_authenticated/_student/profile")({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: () => (
			<div className="p-6">
				<h1 className="text-2xl font-bold">Profil</h1>
				<p className="text-base-content/60">
					Informasi profil pengguna.
				</p>
			</div>
	),
});
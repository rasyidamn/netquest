import { createFileRoute } from "@tanstack/react-router";
import { requireMahasiswa } from "../../../-guard";
import { ModuleDetailPage } from "@/components/roadmap/ModuleDetailPage";

export const Route = createFileRoute(
	"/_authenticated/_student/roadmap/$moduleId",
)({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	component: RouteComponent,
});

function RouteComponent() {
	return <ModuleDetailPage />;
}

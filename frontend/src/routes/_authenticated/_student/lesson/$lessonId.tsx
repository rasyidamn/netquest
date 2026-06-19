import { createFileRoute } from "@tanstack/react-router";
import { requireMahasiswa } from "../../../-guard";
import { LessonPage } from "@/components/pages/Student/LessonPage";

export const Route = createFileRoute(
	"/_authenticated/_student/lesson/$lessonId",
)({
	beforeLoad: ({ context }) => requireMahasiswa({ context }),
	parseParams: (params) => ({
		lessonId: params.lessonId as string,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { lessonId } = Route.useParams();
	return <LessonPage lessonId={lessonId} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { useLessonDetail } from "@/feature/module/hooks/useLessonDetail";
import { TheoryViewer } from "@/feature/gameplay/components/TheoryViewer";
import { QuizEngine } from "@/feature/gameplay/components/QuizEngine";

export const Route = createFileRoute("/_protected/_student/lesson/$lessonId")({
	component: LessonPage,
});

function LessonPage() {
	const { lessonId } = Route.useParams();
	const { data: lesson, isLoading, error } = useLessonDetail(lessonId);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	if (error || !lesson) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<div className="text-error font-bold text-xl">Oops! Terjadi kesalahan.</div>
				<p className="text-base-content/60">Gagal memuat materi atau kuis.</p>
			</div>
		);
	}

	if (lesson.type === "THEORY") {
		return (
			<TheoryViewer
				lessonId={lesson.id}
				moduleId={lesson.moduleId}
				title={lesson.title}
				material={lesson.material}
				questions={lesson.questions}
			/>
		);
	}

	if (lesson.type === "QUIZ") {
		if (!lesson.questions || lesson.questions.length === 0) {
			return (
				<div className="text-center p-10">
					<p className="text-xl font-bold">Kuis Kosong</p>
					<p className="text-base-content/60">Belum ada pertanyaan untuk kuis ini.</p>
				</div>
			);
		}

		return (
			<QuizEngine
				lessonId={lesson.id}
				questions={lesson.questions}
			/>
		);
	}

	return null;
}

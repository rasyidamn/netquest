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
			<div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
				<div className="relative">
					{/* Glow Effect (Pulse) */}
					<div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
					
					{/* Bouncing Container with Logo Text */}
					<div className="relative bg-base-100 px-8 py-4 rounded-3xl border-2 border-primary/20 shadow-2xl animate-bounce">
						<h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter uppercase" style={{ fontFamily: 'var(--font-oxanium)' }}>
							Net<span className="text-base-content">Quest</span>
						</h1>
					</div>
				</div>
				
				<div className="flex flex-col items-center gap-2">
					<h3 className="text-xl md:text-2xl font-bold text-base-content/80 tracking-wide animate-pulse">
						Memuat konten...
					</h3>
				</div>
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
				moduleId={lesson.moduleId}
				questions={lesson.questions}
			/>
		);
	}

	return null;
}

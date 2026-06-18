import { useState, useEffect, useCallback } from "react";
import { useLessonDetail } from "@/hooks/lesson/useLessonDetail";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReadingProgress } from "@/components/lesson/theory/ReadingProgress";
import { LessonHeader } from "@/components/lesson/theory/LessonHeader";
import { MediaEmbed } from "@/components/lesson/theory/MediaEmbed";
import { TheoryViewer } from "@/components/lesson/theory/TheoryViewer";
import { TheoryDoneButton } from "@/components/lesson/theory/TheoryDoneButton";
import { ClipboardText, Exam } from "@phosphor-icons/react";

interface LessonPageProps {
	lessonId: string;
}

function QuizPlaceholder() {
	return (
		<div className="card bg-base-200/50">
			<div className="card-body items-center gap-4 py-16 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-300">
					<Exam size={32} className="text-base-content/60" />
				</div>
				<div>
					<h2 className="card-title text-xl text-base-content">
						Komponen Kuis Belum Tersedia
					</h2>
					<p className="mt-2 text-base-content/60">
						Fitur kuis sedang dalam tahap pengembangan. Nantikan
						pembaruan selanjutnya!
					</p>
				</div>
				<span className="badge badge-ghost badge-lg gap-2 mt-2">
					<ClipboardText size={16} weight="fill" />
					Tipe: Kuis
				</span>
			</div>
		</div>
	);
}

export function LessonPage({ lessonId }: LessonPageProps) {
	const { data: lesson, isLoading, isError, error } = useLessonDetail(lessonId);

	const [scrollPercentage, setScrollPercentage] = useState(0);

	const handleScroll = useCallback(() => {
		const scrollTop = window.scrollY;
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight;

		if (docHeight > 0) {
			const percent = Math.min((scrollTop / docHeight) * 100, 100);
			setScrollPercentage(percent);
		}
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	const isScrollThresholdReached = scrollPercentage >= 90;

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (isError || !lesson) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-8">
				<div className="alert alert-error">
					<span>
						{error?.message || "Gagal memuat materi pelajaran."}
					</span>
				</div>
			</div>
		);
	}

	return (
		<>
			{lesson.type === "THEORY" && <ReadingProgress />}

			<div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
				{/* Header */}
				<div className="mb-6">
					<LessonHeader
						title={lesson.title}
						type={lesson.type}
						xpReward={lesson.xpReward}
					/>
				</div>

				{/* Conditional content based on lesson type */}
				{lesson.type === "THEORY" ? (
					<div className="space-y-6">
						{/* Media embed */}
						{lesson.material?.mediaUrl && (
							<MediaEmbed mediaUrl={lesson.material.mediaUrl} />
						)}

						{/* Theory content */}
						{lesson.material?.content && (
							<TheoryViewer content={lesson.material.content} />
						)}

						{/* Divider */}
						<hr className="border-base-300" />

						{/* Done button */}
						<TheoryDoneButton
							lessonId={lesson.id}
							isScrollThresholdReached={isScrollThresholdReached}
						/>
					</div>
				) : (
					<QuizPlaceholder />
				)}
			</div>
		</>
	);
}
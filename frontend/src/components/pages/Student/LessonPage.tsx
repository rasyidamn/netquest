import { useState, useEffect, useCallback } from "react";
import { useLessonDetail } from "@/hooks/lesson/useLessonDetail";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReadingProgress } from "@/components/lesson/theory/ReadingProgress";
import { LessonHeader } from "@/components/lesson/theory/LessonHeader";
import { MediaEmbed } from "@/components/lesson/theory/MediaEmbed";
import { TheoryViewer } from "@/components/lesson/theory/TheoryViewer";
import { TheoryDoneButton } from "@/components/lesson/theory/TheoryDoneButton";
import { QuizEngine } from "@/components/lesson/quiz/QuizEngine";

interface LessonPageProps {
	lessonId: string;
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
					<QuizEngine lesson={lesson} />
				)}
			</div>
		</>
	);
}
import { IconCheck, IconX, IconRotate, IconArrowLeft } from "@tabler/icons-react";
import type { CompleteQuizResult } from "@/types/api.type";

interface QuizResultProps {
	score: number;
	totalQuestions: number;
	result: CompleteQuizResult & { isLevelUp: boolean };
	onRetry: () => void;
	onBack: () => void;
}

export function QuizResult({
	score,
	totalQuestions,
	result,
	onRetry,
	onBack,
}: QuizResultProps) {
	const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
	const passed = percentage >= 70;

	return (
		<div className="mx-auto max-w-md space-y-6 py-8 text-center">
			{/* Icon */}
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-base-200">
				{passed ? (
					<IconCheck size={40} className="text-success" />
				) : (
					<IconX size={40} className="text-error" />
				)}
			</div>

			{/* Score */}
			<div>
				<h2 className="text-2xl font-bold text-base-content">
					{passed ? "Selamat!" : "Belum Berhasil"}
				</h2>
				<p className="mt-2 text-base text-base-content/60">
					Skor kamu: <span className="font-bold text-base-content">{score}/{totalQuestions}</span>
					{" "}({percentage}%)
				</p>
			</div>

			{/* XP Gained */}
			<div className="rounded-xl bg-base-200 p-4">
				<p className="text-sm text-base-content/60">XP Diperoleh</p>
				<p className="text-2xl font-bold text-primary">+{result.xpGained} XP</p>
				{result.isLevelUp && (
					<span className="mt-1 inline-block rounded-full bg-warning/20 px-3 py-0.5 text-sm font-medium text-warning">
						🎉 Level Up!
					</span>
				)}
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-3">
				<button
					type="button"
					onClick={onRetry}
					className="btn btn-primary w-full gap-2"
				>
					<IconRotate size={18} />
					Coba Lagi
				</button>
				<button
					type="button"
					onClick={onBack}
					className="btn btn-ghost w-full gap-2"
				>
					<IconArrowLeft size={18} />
					Kembali ke Materi
				</button>
			</div>
		</div>
	);
}
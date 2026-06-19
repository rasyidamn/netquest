interface QuizProgressBarProps {
	current: number;
	total: number;
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
	const percentage = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

	return (
		<div className="w-full space-y-1">
			<div className="flex items-center justify-between text-sm text-base-content/60">
				<span>
					Soal {current + 1} dari {total}
				</span>
				<span>{percentage}%</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
				<div
					className="h-full rounded-full bg-primary transition-all duration-300"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
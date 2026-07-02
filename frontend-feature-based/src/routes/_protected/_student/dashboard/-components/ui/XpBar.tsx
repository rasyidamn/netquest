import { cn } from "@/utils/cn";
import type { RankProgress } from "@/utils/rank.util";

interface XpBarProps {
	rankProgress: RankProgress;
	className?: string;
}

export function XpBar({ rankProgress, className }: XpBarProps) {
	const { currentRank, nextRank, xpInCurrentLevel, xpRequiredForNext, percentage, isMaxRank } =
		rankProgress;

	return (
		<div className={cn("space-y-1", className)}>
			<div className="flex items-center justify-between text-xs text-base-content/70">
				<span className={cn("font-medium", currentRank.colorClass)}>
					{currentRank.title}
				</span>
				{!isMaxRank && nextRank && (
					<span className={cn("font-medium", nextRank.colorClass)}>
						{nextRank.title}
					</span>
				)}
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
				<div
					className={cn(
						"h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500",
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<div className="text-right text-xs text-base-content/60">
				{isMaxRank
					? "MAX LEVEL"
					: `${xpInCurrentLevel} / ${xpRequiredForNext} XP`}
			</div>
		</div>
	);
}
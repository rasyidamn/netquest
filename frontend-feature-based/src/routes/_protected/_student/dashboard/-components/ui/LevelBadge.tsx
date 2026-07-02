import { cn } from "@/utils/cn";
import { getCurrentRank } from "@/utils/rank.util";
import { StarIcon } from "lucide-react";


interface LevelBadgeProps {
	xp: number;
	className?: string;
}

export function LevelBadge({ xp, className }: LevelBadgeProps) {
	const rank = getCurrentRank(xp);
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1 text-sm font-medium",
				rank.colorClass,
				className,
			)}
		>
			<StarIcon size={16} className="fill-current" />
			<span>
				Level {rank.level} — {rank.title}
			</span>
		</div>
	);
}
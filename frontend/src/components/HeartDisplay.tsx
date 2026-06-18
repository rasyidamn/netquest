import { cn } from "@/utils/cn";
import { IconHeart, IconClock } from "@tabler/icons-react";

interface HeartDisplayProps {
	heartValue: number;
	countdownLabel?: string;
}

function HeartDisplay({ heartValue, countdownLabel }: HeartDisplayProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex gap-0 sm:gap-1">
				{Array.from({ length: 3 }, (_, i) => (
					<IconHeart
						key={i}
						className={cn(
							i < heartValue ? "fill-red-500" : "fill-base-content/10",
							"size-6 sm:size-8 stroke-1 stroke-base-content/70",
						)}
					/>
				))}
			</div>
			{countdownLabel && heartValue < 3 && (
				<span className="flex items-center gap-1 text-xs text-base-content/60">
					<IconClock size={14} />
					{countdownLabel}
				</span>
			)}
		</div>
	);
}

export default HeartDisplay;

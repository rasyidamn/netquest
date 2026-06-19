import { cn } from "@/utils/cn";
import { IconHeart } from "@tabler/icons-react";

interface HeartStatusBarProps {
	hearts: number;
	maxHearts?: number;
}

export function HeartStatusBar({ hearts, maxHearts = 3 }: HeartStatusBarProps) {
	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: maxHearts }, (_, i) => (
				<IconHeart
					key={i}
					className={cn(
						"size-6 stroke-1 transition-all duration-300",
						i < hearts
							? "fill-red-500 stroke-red-500"
							: i === hearts
								? "fill-red-500/30 stroke-red-300 animate-pulse" // just lost
								: "fill-base-content/10 stroke-base-content/30",
					)}
				/>
			))}
			<span className="ml-2 text-sm font-medium text-base-content/70">
				{hearts}/{maxHearts}
			</span>
		</div>
	);
}
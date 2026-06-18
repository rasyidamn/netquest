import HeartDisplay from "@/components/HeartDisplay";
import { XpBar } from "@/components/XpBar";
import { LevelBadge } from "@/components/LevelBadge";
import { getRankProgress } from "@/utils/rank.util";
import { cn } from "@/utils/cn";

interface StatusBarProps {
	isLoading?: boolean;
	xp: number;
	hearts: number;
	countdownLabel?: string;
	className?: string;
}

function StatusBarSkeleton() {
	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="skeleton size-10 rounded-full" />
						<div className="space-y-2">
							<div className="skeleton h-3 w-24" />
							<div className="skeleton h-4 w-32" />
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="skeleton size-6" />
						<div className="skeleton size-6" />
						<div className="skeleton size-6" />
					</div>
				</div>
				<div className="skeleton h-4 w-full mt-3" />
			</div>
		</div>
	);
}

export function StatusBar({
	isLoading,
	xp,
	hearts,
	countdownLabel,
	className,
}: StatusBarProps) {
	if (isLoading) {
		return <StatusBarSkeleton />;
	}

	const rankProgress = getRankProgress(xp);

	return (
		<div className={cn("card card-compact bg-base-100 shadow-sm border border-base-200", className)}>
			<div className="card-body">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<LevelBadge xp={xp} />
					<HeartDisplay heartValue={hearts} countdownLabel={countdownLabel} />
				</div>
				<XpBar rankProgress={rankProgress} className="mt-3" />
			</div>
		</div>
	);
}
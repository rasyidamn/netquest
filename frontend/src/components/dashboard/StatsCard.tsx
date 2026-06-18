import { cn } from "@/utils/cn";
import { getCurrentRank } from "@/utils/rank.util";
import { IconHeart, IconStar, IconBolt } from "@tabler/icons-react";

interface StatItemProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	iconClass?: string;
}

function StatItem({ icon, label, value, iconClass }: StatItemProps) {
	return (
		<div className="flex items-center gap-3">
			<div
				className={cn(
					"flex size-10 items-center justify-center rounded-lg bg-base-200",
					iconClass,
				)}
			>
				{icon}
			</div>
			<div>
				<p className="text-xs text-base-content/60">{label}</p>
				<p className="text-lg font-bold">{value}</p>
			</div>
		</div>
	);
}

interface StatsCardProps {
	isLoading?: boolean;
	xp?: number;
	hearts?: number;
}

function StatsCardSkeleton() {
	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="skeleton h-4 w-24 mb-4" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="flex items-center gap-3">
						<div className="skeleton size-10 rounded-lg" />
						<div className="space-y-2">
							<div className="skeleton h-3 w-16" />
							<div className="skeleton h-5 w-10" />
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="skeleton size-10 rounded-lg" />
						<div className="space-y-2">
							<div className="skeleton h-3 w-16" />
							<div className="skeleton h-5 w-10" />
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="skeleton size-10 rounded-lg" />
						<div className="space-y-2">
							<div className="skeleton h-3 w-16" />
							<div className="skeleton h-5 w-10" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function StatsCard({ isLoading, xp, hearts }: StatsCardProps) {
	if (isLoading) {
		return <StatsCardSkeleton />;
	}

	const currentLevel = getCurrentRank(xp ?? 0).level;

	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/60">
					Ringkasan
				</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatItem
						icon={<IconBolt size={20} className="text-warning" />}
						label="Total XP"
						value={xp ?? 0}
					/>
					<StatItem
						icon={<IconStar size={20} className="text-primary" />}
						label="Level"
						value={currentLevel}
					/>
					<StatItem
						icon={<IconHeart size={20} className="text-error" />}
						label="Hearts"
						value={hearts ?? 0}
					/>
				</div>
			</div>
		</div>
	);
}
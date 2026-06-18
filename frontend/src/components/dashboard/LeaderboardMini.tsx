import { cn } from "@/utils/cn";
import { getCurrentRank } from "@/utils/rank.util";
import { IconTrophy, IconMedal, IconCrown } from "@tabler/icons-react";
import type { LeaderboardEntry } from "@/types/api.type";

interface LeaderboardMiniProps {
	isLoading?: boolean;
	entries?: LeaderboardEntry;
	currentUserName?: string;
}

function getRankIcon(rank: number) {
	if (rank === 1) return <IconCrown size={20} className="text-yellow-500" />;
	if (rank === 2) return <IconMedal size={20} className="text-gray-400" />;
	if (rank === 3) return <IconMedal size={20} className="text-amber-600" />;
	return <span className="w-5 text-center text-sm font-bold text-base-content/40">{rank}</span>;
}

function LeaderboardSkeleton() {
	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="flex items-center gap-2 mb-4">
					<div className="skeleton size-5" />
					<div className="skeleton h-4 w-32" />
				</div>
				<div className="space-y-2">
					<div className="skeleton h-10 w-full rounded-lg" />
					<div className="skeleton h-10 w-full rounded-lg" />
					<div className="skeleton h-10 w-full rounded-lg" />
					<div className="skeleton h-10 w-full rounded-lg" />
					<div className="skeleton h-10 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}

export function LeaderboardMini({ isLoading, entries, currentUserName }: LeaderboardMiniProps) {
	if (isLoading) {
		return <LeaderboardSkeleton />;
	}

	if (!entries || entries.length === 0) {
		return null;
	}

	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="mb-4 flex items-center gap-2">
					<IconTrophy size={20} className="text-warning" />
					<h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/60">
						Papan Peringkat
					</h3>
				</div>
				<div className="space-y-2">
					{entries.map((entry) => {
						const isCurrentUser = entry.name === currentUserName;
						const entryLevel = getCurrentRank(entry.xp).level;
						return (
							<div
								key={entry.rank}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2",
									isCurrentUser && "bg-primary/10 ring-1 ring-primary/20",
								)}
							>
								<div className="flex w-8 items-center justify-center">
									{getRankIcon(entry.rank)}
								</div>
								<div className="flex-1">
									<p
										className={cn(
											"text-sm font-medium",
											isCurrentUser && "text-primary",
										)}
									>
										{entry.name}
										{isCurrentUser && (
											<span className="ml-1 text-xs text-primary/60">(Kamu)</span>
										)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold">{entry.xp}</p>
									<p className="text-xs text-base-content/40">
										Lv.{entryLevel}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
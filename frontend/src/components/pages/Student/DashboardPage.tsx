import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RoadmapPreview } from "@/components/dashboard/RoadmapPreview";
import { LeaderboardMini } from "@/components/dashboard/LeaderboardMini";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { StatusBar } from "@/components/StatusBar";
import { useProfile } from "@/hooks/auth/useProfile";
import { useMyProgress } from "@/hooks/progress/useMyProgress";
import { useModules } from "@/hooks/module/useModules";
import { useLeaderboardMini } from "@/hooks/leaderboard/useLeaderboardMini";

export function DashboardPage() {
	const {
		data: profile,
		isLoading: profileLoading,
	} = useProfile();
	const {
		data: progress,
		isLoading: progressLoading,
	} = useMyProgress();
	const {
		data: modules,
		isLoading: modulesLoading,
	} = useModules();
	const {
		data: leaderboard,
		isLoading: lbLoading,
	} = useLeaderboardMini();

	const isDashboardLoading =
		profileLoading || progressLoading || modulesLoading || lbLoading;

	return (
		<div className="space-y-6 p-4 lg:p-6">
			<WelcomeBanner
				isLoading={isDashboardLoading}
				name={profile?.name}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<StatsCard
						isLoading={isDashboardLoading}
						xp={profile?.xp}
						hearts={profile?.hearts}
					/>
					<StatusBar
						isLoading={isDashboardLoading}
						xp={profile?.xp ?? 0}
						hearts={profile?.hearts ?? 0}
					/>
					<ContinueLearningCard
						isLoading={isDashboardLoading}
						progress={progress}
					/>
					<RoadmapPreview
						isLoading={isDashboardLoading}
						modules={modules}
						progress={progress}
					/>
				</div>
				<div className="space-y-6">
					<LeaderboardMini
						isLoading={isDashboardLoading}
						entries={leaderboard}
						currentUserName={profile?.name}
					/>
				</div>
			</div>
		</div>
	);
}
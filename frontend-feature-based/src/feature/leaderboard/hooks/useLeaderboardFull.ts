import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "../api/leaderboardApi";

export function useLeaderboardFull(limit: number = 20) {
	return useQuery({
		queryKey: ["leaderboard", "full", limit],
		queryFn: async () => {
			const res = await leaderboardApi.getLeaderboard(limit);
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil leaderboard");
			}
			return res.data;
		},
		staleTime: 60_000,
	});
}

import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "../api/leaderboardApi";

export function useLeaderboardMini() {
	return useQuery({
		queryKey: ["leaderboard", "mini"],
		queryFn: async () => {
			const res = await leaderboardApi.getLeaderboard(5);
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil leaderboard");
			}
			return res.data;
		},
		staleTime: 30_000,
	});
}

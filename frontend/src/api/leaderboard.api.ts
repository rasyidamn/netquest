import type { ApiResponse, LeaderboardEntry } from "@/types/api.type";
import apiClient from "@/api/apiClient";

export const leaderboardApi = {
	getLeaderboard: async (limit: number = 5): Promise<ApiResponse<LeaderboardEntry>> => {
		const response = await apiClient.get(`/leaderboard?limit=${limit}`);
		return response.data;
	},
};

import { apiClient } from "@/core/api/apiClient";
import type { LeaderboardEntry } from "../schema/leaderboard.schema";
import type { ApiResponse } from "@/core/types/apiResponseType";



export const leaderboardApi = {
	getLeaderboard: async (limit: number = 5): Promise<ApiResponse<LeaderboardEntry>> => {
		const response = await apiClient.get(`/leaderboard?limit=${limit}`);
		return response.data;
	},
};

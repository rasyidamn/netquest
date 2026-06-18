import type { ApiResponse, ProgressItem } from "@/types/api.type";
import apiClient from "@/api/apiClient";

export const progressApi = {
	getMyProgress: async (): Promise<ApiResponse<ProgressItem[]>> => {
		const response = await apiClient.get("/progress");
		return response.data;
	},
};

import { apiClient } from "@/core/api/apiClient";
import type { ApiResponse } from "@/core/types/apiResponseType";
import type { ProgressItem } from "../schema/progress.schema";

export const progressApi = {
	getMyProgress: async (): Promise<ApiResponse<ProgressItem[]>> => {
		const response = await apiClient.get("/progress");
		return response.data;
	},
};

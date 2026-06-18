import type { ApiResponse, TheoryDoneResponse } from "@/types/api.type";
import apiClient from "@/api/apiClient";

export const gameplayApi = {
	theoryDone: async (
		lessonId: string,
	): Promise<ApiResponse<TheoryDoneResponse>> => {
		const response = await apiClient.post("/api/gameplay/theory-done", {
			lessonId,
		});
		return response.data;
	},
};
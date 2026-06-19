import type { ApiResponse, LessonDetailType } from "@/types/api.type";
import apiClient from "@/api/apiClient";

export const lessonApi = {
	getLessonDetail: async (
		lessonId: string,
	): Promise<ApiResponse<LessonDetailType>> => {
		const response = await apiClient.get(`/lessons/${lessonId}`);
		return response.data;
	},
};
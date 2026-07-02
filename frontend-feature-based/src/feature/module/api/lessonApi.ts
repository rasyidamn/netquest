import type { ApiResponse } from "@/core/types/apiResponseType";
import type { LessonDetailType, LessonType } from "../schema/lesson.schema";
import type { Question } from "../schema/question.schema";
import { apiClient } from "@/core/api/apiClient";

export const lessonApi = {
	getLessonDetail: async (
		lessonId: string,
	): Promise<ApiResponse<LessonDetailType>> => {
		const response = await apiClient.get(`/lessons/${lessonId}`);
		return response.data;
	},
	updateLesson: async ({ id, data }: { id: string; data: Partial<LessonType> }): Promise<ApiResponse<LessonType>> => {
		const response = await apiClient.put(`/lessons/${id}`, data);
		return response.data;
	},
	deleteLesson: async (id: string): Promise<ApiResponse<null>> => {
		const response = await apiClient.delete(`/lessons/${id}`);
		return response.data;
	},
	upsertMaterial: async ({ id, content, mediaUrl }: { id: string; content: string; mediaUrl?: string }) => {
		const response = await apiClient.put(`/lessons/${id}/material`, { content, mediaUrl });
		return response.data;
	},
	createQuestion: async (lessonId: string, data: any): Promise<ApiResponse<Question>> => {
		const response = await apiClient.post(`/lessons/${lessonId}/questions`, data);
		return response.data;
	},
	updateQuestion: async ({ id, data }: { id: string; data: any }): Promise<ApiResponse<Question>> => {
		const response = await apiClient.put(`/lessons/questions/${id}`, data);
		return response.data;
	},
	deleteQuestion: async (id: string): Promise<ApiResponse<null>> => {
		const response = await apiClient.delete(`/lessons/questions/${id}`);
		return response.data;
	}
};

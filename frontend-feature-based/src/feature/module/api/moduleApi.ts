import { apiClient } from "@/core/api/apiClient";
import type { ApiResponse } from "@/core/types/apiResponseType";
import type { ModuleType } from "@/schemas/module.schema";
import type { LessonType } from "../schema/lesson.schema";

export const moduleApi = {
	getModules: async (): Promise<ApiResponse<ModuleType[]>> => {
		const response = await apiClient.get("/modules");
		return response.data;
	},
	getLessons: async (
		moduleId: string | number,
	): Promise<ApiResponse<LessonType[]>> => {
		const response = await apiClient.get(`/modules/${moduleId}/lessons`);
		return response.data;
	},
	createModule: async (data: Partial<ModuleType>): Promise<ApiResponse<ModuleType>> => {
		const response = await apiClient.post("/modules", data);
		return response.data;
	},
	updateModule: async ({ id, data }: { id: string; data: Partial<ModuleType> }): Promise<ApiResponse<ModuleType>> => {
		const response = await apiClient.patch(`/modules/${id}`, data);
		return response.data;
	},
	deleteModule: async (id: string): Promise<ApiResponse<null>> => {
		const response = await apiClient.delete(`/modules/${id}`);
		return response.data;
	},
	createLesson: async (moduleId: string, data: Partial<LessonType>): Promise<ApiResponse<LessonType>> => {
		const response = await apiClient.post(`/modules/${moduleId}/lessons`, data);
		return response.data;
	}
};

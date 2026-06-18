import type { ApiResponse, ModuleType, LessonType } from "@/types/api.type";
import apiClient from "@/api/apiClient";

export const moduleApi = {
	getModules: async (): Promise<ApiResponse<ModuleType[]>> => {
		const response = await apiClient.get("/modules");
		return response.data;
	},
	getLessons: async (moduleId: string | number): Promise<ApiResponse<LessonType[]>> => {
		const response = await apiClient.get(`/modules/${moduleId}/lessons`);
		return response.data;
	},
};

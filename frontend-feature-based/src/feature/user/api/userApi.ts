import type { ApiResponse } from "@/core/types/apiResponseType";
import { apiClient } from "@/core/api/apiClient";
import type { UserType, UpdateUserType, CreateUserType } from "../schema/user.schema";

export type UserStatsType = {
	totalStudents: number;
	totalAdmins: number;
	avgXp: number;
	activeStudents: number;
};

export const userApi = {
	getUsers: async (): Promise<ApiResponse<UserType[]>> => {
		const response = await apiClient.get("/users");
		return response.data;
	},
	getUserStats: async (): Promise<ApiResponse<UserStatsType>> => {
		const response = await apiClient.get("/users/stats");
		return response.data;
	},
	createUser: async (data: CreateUserType): Promise<ApiResponse<UserType>> => {
		const response = await apiClient.post("/users", data);
		return response.data;
	},
	getUserProgress: async (id: string): Promise<ApiResponse<any[]>> => {
		const response = await apiClient.get(`/users/${id}/progress`);
		return response.data;
	},
	resetPassword: async (id: string): Promise<ApiResponse<{ resetTo: string }>> => {
		const response = await apiClient.patch(`/users/${id}/reset-password`);
		return response.data;
	},
	updateUser: async ({
		id,
		data,
	}: {
		id: string;
		data: UpdateUserType;
	}): Promise<ApiResponse<UserType>> => {
		const response = await apiClient.put(`/users/${id}`, data);
		return response.data;
	},
	deleteUser: async (id: string): Promise<ApiResponse<null>> => {
		const response = await apiClient.delete(`/users/${id}`);
		return response.data;
	},
};

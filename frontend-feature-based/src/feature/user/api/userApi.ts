import type { ApiResponse } from "@/core/types/apiResponseType";
import { apiClient } from "@/core/api/apiClient";
import type { UserType, UpdateUserType } from "../schema/user.schema";

export const userApi = {
	getUsers: async (): Promise<ApiResponse<UserType[]>> => {
		const response = await apiClient.get("/users");
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

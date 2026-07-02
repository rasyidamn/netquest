import { apiClient } from "@/core/api/apiClient";
import type { ApiResponse } from "@/core/types/apiResponseType";
import type {
	LoginInput,
	RegisterInput,
	UserWithoutPassword,
} from "../schema/auth.schema";

export const authApi = {
	login: async (
		data: LoginInput,
	): Promise<ApiResponse<{ user: UserWithoutPassword }>> => {
		const response = await apiClient.post("/auth/login", data);
		return response.data;
	},

	register: async (
		data: RegisterInput,
	): Promise<ApiResponse<UserWithoutPassword>> => {
		const { passwordConfirm, ...payload } = data;
		const response = await apiClient.post("/auth/register", payload);
		return response.data;
	},

	logout: async (): Promise<ApiResponse> => {
		const response = await apiClient.post("/auth/logout");
		return response.data;
	},

	getProfile: async (): Promise<ApiResponse<UserWithoutPassword>> => {
		const response = await apiClient.get("/auth/profile");
		return response.data;
	},
};

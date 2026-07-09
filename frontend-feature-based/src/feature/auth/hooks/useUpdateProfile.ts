import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import toast from "react-hot-toast";
import type { ApiResponse } from "@/core/types/apiResponseType";
import type { UserWithoutPassword } from "../schema/auth.schema";

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResponse<UserWithoutPassword>,
		any,
		{ name?: string; password?: string }
	>({
		mutationFn: (data) => authApi.updateProfile(data),
		onSuccess: (response) => {
			toast.success(response.message || "Profil berhasil diperbarui!");
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Gagal memperbarui profil!",
			);
		},
	});
};

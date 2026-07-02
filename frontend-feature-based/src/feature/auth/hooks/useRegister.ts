import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";

export function useRegister() {
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.register,
		onSuccess: () => {
			toast.success("Akun berhasil dibuat! Silakan login.");
			router.navigate({ to: "/auth/login" });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Registrasi gagal!");
		},
	});
}

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";

export function useLogin() {
	const setLoginParams = useAuthStore((s) => s.setLoginParams);
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (res) => {
			if (res.success && res.data) {
				toast.success("Berhasil login!");
				if (!res.data.user.role) return;
				setLoginParams(res.data.user.role);
				if (res.data.user.role === "ADMIN") {
					router.navigate({ to: "/admin" });
				} else {
					router.navigate({ to: "/dashboard" });
				}
			}
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Login gagal!");
		},
	});
}

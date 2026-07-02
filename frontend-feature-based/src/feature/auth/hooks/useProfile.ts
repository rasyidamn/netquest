import { authApi } from "@/feature/auth/api/authApi";
import { useAuthStore } from "@/feature/auth/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";


export function useProfile() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const res = await authApi.getProfile();
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil profile");
			}
			return res.data;
		},
		enabled: isAuthenticated,
		refetchOnWindowFocus: true,
	});
}

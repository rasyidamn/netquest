import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

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

import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/api/progress.api";

export function useMyProgress() {
	return useQuery({
		queryKey: ["myProgress"],
		queryFn: async () => {
			const res = await progressApi.getMyProgress();
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil progress");
			}
			return res.data;
		},
	});
}
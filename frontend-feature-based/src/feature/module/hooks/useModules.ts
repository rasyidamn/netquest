import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "../api/moduleApi";


export function useModules() {
	return useQuery({
		queryKey: ["modules"],
		queryFn: async () => {
			const res = await moduleApi.getModules();
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil modul");
			}
			return res.data;
		},
	});
}
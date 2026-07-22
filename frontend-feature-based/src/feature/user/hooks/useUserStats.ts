import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export function useUserStats() {
	return useQuery({
		queryKey: ["admin-user-stats"],
		queryFn: async () => {
			const res = await userApi.getUserStats();
			return res.data;
		},
	});
}

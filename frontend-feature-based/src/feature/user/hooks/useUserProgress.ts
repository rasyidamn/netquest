import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export function useUserProgress(userId: string | null) {
	return useQuery({
		queryKey: ["admin-user-progress", userId],
		queryFn: async () => {
			const res = await userApi.getUserProgress(userId!);
			return res.data;
		},
		enabled: !!userId,
	});
}

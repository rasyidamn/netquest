import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { UserType } from "../schema/user.schema";

export function useUsers() {
	return useQuery<UserType[]>({
		queryKey: ["admin-users"],
		queryFn: async () => {
			const res = await userApi.getUsers();
			if (!res.success) throw new Error(res.message);
			return res.data || [];
		},
	});
}

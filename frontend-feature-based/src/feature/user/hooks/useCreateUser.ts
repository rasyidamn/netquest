import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { CreateUserType } from "../schema/user.schema";

export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateUserType) => userApi.createUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
			queryClient.invalidateQueries({ queryKey: ["admin-user-stats"] });
		},
	});
}

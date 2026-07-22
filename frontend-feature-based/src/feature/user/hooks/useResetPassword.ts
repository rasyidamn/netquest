import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export function useResetPassword() {
	return useMutation({
		mutationFn: (id: string) => userApi.resetPassword(id),
	});
}

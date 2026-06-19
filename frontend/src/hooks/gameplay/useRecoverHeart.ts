import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameplayApi } from "@/api/gameplay.api";
import type { RecoverHeartResult } from "@/types/api.type";

export function useRecoverHeart() {
	const queryClient = useQueryClient();

	return useMutation<RecoverHeartResult, Error, { lessonId: string; readDuration: number }>({
		mutationFn: async ({ lessonId, readDuration }) => {
			const res = await gameplayApi.recoverHeart(lessonId, readDuration);
			if (!res.success) {
				throw new Error(res.message || "Gagal memulihkan heart");
			}
			return res.data as RecoverHeartResult;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
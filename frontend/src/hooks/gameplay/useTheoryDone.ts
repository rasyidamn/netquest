import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameplayApi } from "@/api/gameplay.api";
import type { TheoryDoneResponse } from "@/types/api.type";

export function useTheoryDone() {
	const queryClient = useQueryClient();

	return useMutation<TheoryDoneResponse, Error, string>({
		mutationFn: async (lessonId: string) => {
			const res = await gameplayApi.theoryDone(lessonId);
			if (!res.success) {
				throw new Error(res.message || "Gagal menyelesaikan materi teori");
			}
			return res.data as TheoryDoneResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["myProgress"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
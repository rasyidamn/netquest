import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TheoryDoneResponse } from "../types/gameplay.types";
import { gameplayApi } from "../api/gameplay.api";

export function useTheoryDone() {
	const queryClient = useQueryClient();

	return useMutation<TheoryDoneResponse, Error, { lessonId: string }>({
		mutationFn: async ({ lessonId }) => {
			const res = await gameplayApi.theoryDone(lessonId);
			if (!res.success) {
				throw new Error(
					res.message || "Gagal menyelesaikan materi teori",
				);
			}
			return res.data as TheoryDoneResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["myProgress"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

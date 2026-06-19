import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameplayApi } from "@/api/gameplay.api";
import { calculateLevel } from "@/utils/leveling.util";
import type { CompleteQuizResult } from "@/types/api.type";

export function useCompleteQuiz(currentTotalXp: number) {
	const queryClient = useQueryClient();

	return useMutation<CompleteQuizResult & { isLevelUp: boolean }, Error, { lessonId: string; finalScore: number }>({
		mutationFn: async ({ lessonId, finalScore }) => {
			const res = await gameplayApi.completeQuiz(lessonId, finalScore);
			if (!res.success) {
				throw new Error(res.message || "Gagal menyelesaikan kuis");
			}
			const data = res.data as CompleteQuizResult;
			const oldLevel = calculateLevel(currentTotalXp);
			const newLevel = calculateLevel(data.currentTotalXp);
			return { ...data, isLevelUp: newLevel > oldLevel };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["myProgress"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
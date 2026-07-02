import { useMutation, useQueryClient } from "@tanstack/react-query";

import { calculateLevel } from "@/utils/leveling.util";
import type { CompleteQuizResult } from "../types/gameplay.types";
import { gameplayApi } from "../api/gameplay.api";

export function useCompleteQuiz(currentTotalXp: number) {
	const queryClient = useQueryClient();

	return useMutation<
		CompleteQuizResult & { isLevelUp: boolean },
		Error,
		{ lessonId: string }
	>({
		mutationFn: async ({ lessonId }) => {
			// 1. Kirim payload yang berisi ID materi
			const res = await gameplayApi.completeQuiz(lessonId);

			if (!res.success) {
				throw new Error(res.message || "Gagal menyelesaikan kuis");
			}

			const data = res.data as CompleteQuizResult;

			// 2. Kalkulasi Level-Up menggunakan data XP terbaru dari server
			const oldLevel = calculateLevel(currentTotalXp);
			const newLevel = calculateLevel(data.newTotalXp);

			return { ...data, isLevelUp: newLevel > oldLevel };
		},
		onSuccess: () => {
			// 3. Sinkronisasi state global secara otomatis
			queryClient.invalidateQueries({ queryKey: ["myProgress"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuizSubmitResult } from "../types/gameplay.types";
import { gameplayApi } from "../api/gameplay.api";


export function useSubmitQuiz() {
	const queryClient = useQueryClient();

	return useMutation<
		QuizSubmitResult,
		Error,
		{ lessonId: string; questionId: string; answer: string }
	>({
		mutationFn: async ({ lessonId, questionId, answer }) => {
			const res = await gameplayApi.submitQuiz(
				lessonId,
				questionId,
				answer,
			);
			if (!res.success) {
				throw new Error(res.message || "Gagal mengirim jawaban");
			}
			return res.data as QuizSubmitResult;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["myProgress"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

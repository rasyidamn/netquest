import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameplayApi } from "@/api/gameplay.api";
import type { QuizSubmitResult } from "@/types/api.type";

export function useSubmitQuiz() {
	const queryClient = useQueryClient();

	return useMutation<QuizSubmitResult, Error, { lessonId: string; questionId: string; optionId: string }>({
		mutationFn: async ({ lessonId, questionId, optionId }) => {
			const res = await gameplayApi.submitQuiz(lessonId, questionId, optionId);
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
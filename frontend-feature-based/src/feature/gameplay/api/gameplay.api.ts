import type { ApiResponse } from "@/core/types/apiResponseType";
import type {
	CompleteQuizResult,
	QuizSubmitResult,
	RecoverHeartResult,
	TheoryDoneResponse,
} from "../types/gameplay.types";
import { apiClient } from "@/core/api/apiClient";

export const gameplayApi = {
	theoryDone: async (
		lessonId: string,
	): Promise<ApiResponse<TheoryDoneResponse>> => {
		const response = await apiClient.post("/gameplay/theory-done", {
			lessonId,
		});
		return response.data;
	},

	submitQuiz: async (
		lessonId: string,
		questionId: string,
		answer: string,
	): Promise<ApiResponse<QuizSubmitResult>> => {
		const response = await apiClient.post("/gameplay/submit-quiz", {
			lessonId,
			questionId,
			answer,
		});
		return response.data;
	},

	completeQuiz: async (
		lessonId: string,
	): Promise<ApiResponse<CompleteQuizResult>> => {
		const response = await apiClient.post("/gameplay/complete-quiz", {
			lessonId,
		});
		return response.data;
	},

	recoverHeart: async (
		lessonId: string,
		readDuration: number,
	): Promise<ApiResponse<RecoverHeartResult>> => {
		const response = await apiClient.post("/gameplay/recover-heart", {
			lessonId,
			readDuration,
		});
		return response.data;
	},
};

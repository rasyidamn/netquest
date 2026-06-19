import type {
	ApiResponse,
	TheoryDoneResponse,
	QuizSubmitResult,
	CompleteQuizResult,
	RecoverHeartResult,
} from "@/types/api.type";
import apiClient from "@/api/apiClient";

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
		optionId: string,
	): Promise<ApiResponse<QuizSubmitResult>> => {
		const response = await apiClient.post("/gameplay/submit-quiz", {
			lessonId,
			questionId,
			optionId,
		});
		return response.data;
	},

	completeQuiz: async (
		lessonId: string,
		finalScore: number,
	): Promise<ApiResponse<CompleteQuizResult>> => {
		const response = await apiClient.post("/gameplay/complete-quiz", {
			lessonId,
			finalScore,
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

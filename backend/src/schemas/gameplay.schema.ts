import z from "zod";

export class GameplaySchema {
	static readonly SUBMIT_ANSWER_REQUEST = z
		.object({
			lessondId: z.uuid(),
			questionId: z.uuid(),
			optionId: z.uuid(),
		})
		.strict();

	static readonly RECOVER_HEART_REQUEST = z
		.object({
			lessonId: z.uuid("Format ID Pelajaran tidak valid"),
			readDuration: z
				.number()
				.min(
					60,
					"Anda membaca terlalu cepat! Pahami materi minimal 60 detik.",
				),
		})
		.strict();

	static readonly COMPLETE_QUIZ_REQUEST = z
		.object({
			lessonId: z.uuid(),
			finalScore: z.number().min(0).max(100), // Asumsi skor 0-100
		})
		.strict();
}

export type SubmitAnswerRequest = z.infer<
	typeof GameplaySchema.SUBMIT_ANSWER_REQUEST
>;
export type RecoverHeartRequest = z.infer<
	typeof GameplaySchema.RECOVER_HEART_REQUEST
>;
export type CompleteQuizRequest = z.infer<
	typeof GameplaySchema.COMPLETE_QUIZ_REQUEST
>;

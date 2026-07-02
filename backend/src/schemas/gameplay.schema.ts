import z from "zod";

export class GameplaySchema {
	static readonly SUBMIT_ANSWER_REQUEST = z
		.object({
			lessonId: z.uuid(),
			questionId: z.uuid(),
			// 'answer' bisa berupa UUID, teks "ping 8.8.8.8", atau stringified JSON '["A", "B"]'
			answer: z.string().min(1, "Jawaban tidak boleh kosong"),
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
			lessonId: z.string().uuid(),
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

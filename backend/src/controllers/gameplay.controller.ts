import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { LessonSchema } from "../schemas/lesson.schema.js";
import { GameplayService } from "../services/gameplay.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
import { GameplaySchema } from "../schemas/gameplay.schema.js";

export class GameplayController {
	static theoryDone = catchAsync(async (req: Request, res: Response) => {
		const params = LessonSchema.LESSON_ID_PARAM.parse(req.params);
		const userId = req.user?.id;
		const responseData = await GameplayService.theoryDone(
			userId as string,
			params.id,
		);
		sendSuccess(
			res,
			StatusCodes.OK,
			"Berhasil menyelesaikan lesson theory!",
			responseData,
		);
	});

	static submitQuiz = catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id;
		const validatedData = GameplaySchema.SUBMIT_ANSWER_REQUEST.parse(
			req.body,
		);
		const responseData = await GameplayService.submitQuiz(
			userId as string,
			validatedData,
		);
		const message = responseData.isCorrect
			? "Jawaban tepat!"
			: "Jawaban salah!";
		sendSuccess(res, StatusCodes.OK, message, responseData);
	});

	static completeQuiz = catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id;
		const validatedData = GameplaySchema.COMPLETE_QUIZ_REQUEST.parse(
			req.body,
		);
		const responseData = await GameplayService.completeQuiz(
			userId as string,
			validatedData,
		);
		sendSuccess(
			res,
			StatusCodes.OK,
			"Kuis diselesaikan, memproses progres belajar...",
			responseData,
		);
	});

	static recoverHeart = catchAsync(async (req: Request, res: Response) => {
		const userId = req.user?.id;
		const validatedData = GameplaySchema.RECOVER_HEART_REQUEST.parse(
			req.body,
		);
		const responseData = await GameplayService.recoverHeart(
			userId as string,
			validatedData,
		);
		const message =
			responseData.heartsLeft === 3
				? "Nyawa pulih sepenuhnya! Kamu siap tempur lagi."
				: `Nyawa pulih! Sisa nyawa kamu sekarang: ${responseData.heartsLeft}.`;
		sendSuccess(res, StatusCodes.OK, message, responseData);
	});
}

import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { OptionSchema } from "./option.schema.js";
import { QuestionType } from "../generated/prisma/enums.js";

extendZodWithOpenApi(z);

export class QuestionSchema {
	static readonly QUESTION_MODEL = z.object({
		id: z
			.uuid()
			.openapi({ example: "33333333-4444-5555-6666-777777777777" }),
		lessonId: z
			.string()
			.openapi({ example: "11111111-2222-3333-4444-555555555555" }),
		questionText: z.string().min(5, "Pertanyaan harus jelas").openapi({
			example:
				"Manakah dari berikut ini yang merupakan IP Address kelas C?",
		}),
		xpReward: z
			.number()
			.int()
			.nonnegative("XP tidak boleh negatif")
			.openapi({ example: 15 }),
		questionSequence: z
			.number()
			.int()
			.positive("Urutan harus positif")
			.openapi({ example: 1 }),
		type: z.enum(QuestionType).openapi({ example: "MULTIPLE_CHOICE" }),
	});

	static readonly QUESTION_OPTIONS_MODEL = this.QUESTION_MODEL.extend({
		options: z.array(OptionSchema.OPTION_MODEL),
	}).strict();

	static readonly CREATE_BASE = this.QUESTION_MODEL.pick({
		questionText: true,
		xpReward: true,
		type: true,
		questionSequence: true,
	}).extend({
		options: z.array(
			OptionSchema.OPTION_MODEL.pick({
				optionText: true,
				isCorrect: true,
			}),
		).optional(),
		advancedOptions: z.array(z.string()).optional(),
		answerPattern: z.any().optional(),
	}).strict();

	static readonly CREATE_QUESTION_WITH_OPTIONS_REQUEST =
		this.CREATE_BASE
			.refine((data) => {
				if (data.type === "MULTIPLE_CHOICE" && (!data.options || data.options.length < 2)) {
					return false;
				}
				if ((data.type === "MATCHING" || data.type === "SORTING") && (!data.advancedOptions || !data.answerPattern)) {
					return false;
				}
				return true;
			}, {
				message: "Opsi tidak valid untuk tipe soal ini",
				path: ["options"]
			});

	static readonly UPDATE_QUESTION_WITH_OPTIONS_REQUEST =
		this.CREATE_BASE.partial().strict();

	static readonly QUESTION_ID_PARAM = z.object({
		id: z.uuid("Format ID pertanyaan tidak valid!"),
	});
}

export type CreateQuestionWithOptionRequest = z.infer<
	typeof QuestionSchema.CREATE_QUESTION_WITH_OPTIONS_REQUEST
>;
export type UpdateQuestioWithOptionsRequest = z.infer<
	typeof QuestionSchema.UPDATE_QUESTION_WITH_OPTIONS_REQUEST
>;
export type QuestionResponse = z.infer<typeof QuestionSchema.QUESTION_MODEL>;
export type QuestionOptionsResponse = z.infer<
	typeof QuestionSchema.QUESTION_OPTIONS_MODEL
>;

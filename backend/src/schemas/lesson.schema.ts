import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { LessonTypeEnum } from "../generated/prisma/enums.js"; // Sesuaikan path
import { MaterialSchema } from "./material.schema.js";
import { QuestionSchema } from "./question.schema.js";
import { OptionSchema } from "./option.schema.js";
import { ModuleSchema } from "./module.schema.js";

extendZodWithOpenApi(z);

export class LessonSchema {
	static readonly LESSON_MODEL = z.object({
		id: z
			.uuid()
			.openapi({ example: "11111111-2222-3333-4444-555555555555" }),
		moduleId: z
			.uuid("Format Module ID tidak valid")
			.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		title: z
			.string()
			.trim()
			.min(3, "Judul lesson minimal 3 karakter")
			.openapi({ example: "Kabel UTP dan STP" }),
		lessonSequence: z
			.number()
			.int()
			.positive("Urutan harus dimulai dari 1")
			.openapi({ example: 1 }),
		type: z.enum(LessonTypeEnum).openapi({ example: "MATERIAL" }), // Asumsi enum Anda MATERIAL atau QUIZ
		xpReward: z
			.number()
			.int()
			.nonnegative("XP tidak boleh negatif")
			.openapi({ example: 50 }),
		isPublished: z
			.boolean()
			.default(false)
			.openapi({ example: false }),
	});

	static readonly LESSON_WITH_MODULE = this.LESSON_MODEL.extend({
		module: ModuleSchema.MODULE_MODEL,
	}).strict();

	static readonly CREATE_LESSON_REQUEST = this.LESSON_MODEL.omit({
		id: true,
		moduleId: true,
	}).strict();

	static readonly UPDATE_LESSON_REQUEST =
		this.CREATE_LESSON_REQUEST.partial().strict();

	static readonly LESSON_ID_PARAM = z.object({
		id: z.uuid("Format ID lesson tidak valid!"),
	});

	static readonly LESSON_DETAIL_ADMIN_RESPONSE = z.discriminatedUnion(
		"type",
		[
			this.LESSON_MODEL.extend({
				type: z.literal(LessonTypeEnum.THEORY),
				material: MaterialSchema.MATERIAL_MODEL.nullable(),
				questions: z.array(
					QuestionSchema.QUESTION_MODEL.extend({
						options: z.array(OptionSchema.OPTION_MODEL),
					}),
				).optional(),
				module: ModuleSchema.MODULE_MODEL
			}),
			this.LESSON_MODEL.extend({
				type: z.literal(LessonTypeEnum.QUIZ),
				questions: z.array(
					QuestionSchema.QUESTION_MODEL.extend({
						options: z.array(OptionSchema.OPTION_MODEL),
					}),
				),
				module: ModuleSchema.MODULE_MODEL
			}),
		],
	);

	static readonly LESSON_DETAIL_MAHASISWA_RESPONSE = z.discriminatedUnion(
		"type",
		[
			this.LESSON_MODEL.extend({
				type: z.literal(LessonTypeEnum.THEORY),
				material: MaterialSchema.MATERIAL_MODEL.nullable(),
				questions: z.array(
					QuestionSchema.QUESTION_MODEL.extend({
						options: z.array(
							OptionSchema.OPTION_MODEL.omit({ isCorrect: true }),
						),
					}),
				).optional(),
			}),
			this.LESSON_MODEL.extend({
				type: z.literal(LessonTypeEnum.QUIZ),
				questions: z.array(
					QuestionSchema.QUESTION_MODEL.extend({
						options: z.array(
							OptionSchema.OPTION_MODEL.omit({ isCorrect: true }),
						),
					}),
				),
			}),
		],
	);
}

export type CreateLessonRequest = z.infer<
	typeof LessonSchema.CREATE_LESSON_REQUEST
>;
export type UpdateLessonRequest = z.infer<
	typeof LessonSchema.UPDATE_LESSON_REQUEST
>;
export type LessonResponse = z.infer<typeof LessonSchema.LESSON_MODEL>;
export type LessonWithModule = z.infer<typeof LessonSchema.LESSON_WITH_MODULE>

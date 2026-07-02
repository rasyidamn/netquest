import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import {
	LessonSchema,
	type CreateLessonRequest,
	type LessonResponse,
} from "../schemas/lesson.schema.js";
import type { ModuleIdParam } from "../schemas/module.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import z from "zod";
import {
	MaterialSchema,
	type MaterialResponse,
	type UpdateMaterialRequest,
} from "../schemas/material.schema.js";
import type {
	MaterialCreateInput,
	MaterialUncheckedCreateInput,
	MaterialUncheckedUpdateInput,
	MaterialUpdateInput,
	OptionCreateManyQuestionInput,
} from "../generated/prisma/models.js";
import {
	LessonTypeEnum,
	RoleEnum,
	QuestionType,
	type Prisma,
} from "../generated/prisma/client.js";
import {
	QuestionSchema,
	type CreateQuestionWithOptionRequest,
	type QuestionOptionsResponse,
	type QuestionResponse,
	type UpdateQuestioWithOptionsRequest,
} from "../schemas/question.schema.js";

export class LessonService {
	static getLessonByModule = async (
		moduleId: string,
	): Promise<LessonResponse[]> => {
		const module = await prisma.module.findUnique({
			where: {
				id: moduleId,
			},
		});
		if (!module) {
			throw new ApiError(
				StatusCodes.NOT_FOUND,
				"Module tidak ditemukan!",
			);
		}

		const lessons = await prisma.lesson.findMany({
			where: {
				moduleId: moduleId,
			},
		});
		if (!lessons) {
			return [];
		}

		const responseData = z.array(LessonSchema.LESSON_MODEL).parse(lessons);
		return responseData;
	};

	static getLessonDetail = async (
		lessonId: string,
		role: string,
	): Promise<LessonResponse> => {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: lessonId,
			},
			include: {
				module:true,
				material: true,
				questions: {
					include: {
						options: true,
					},
				},
			},
		});
		if (!lesson) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
		}

		if (role === RoleEnum.ADMIN) {
			return LessonSchema.LESSON_DETAIL_ADMIN_RESPONSE.parse(lesson);
		} else {
			return LessonSchema.LESSON_DETAIL_MAHASISWA_RESPONSE.parse(lesson);
		}
	};

	static createLesson = async (
		moduleId: string,
		validatedData: CreateLessonRequest,
	): Promise<LessonResponse> => {
		const module = await prisma.module.findUnique({
			where: {
				id: moduleId,
			},
		});
		if (!module) {
			throw new ApiError(StatusCodes.NOT_FOUND, "module tidak ditemukan");
		}

		const newLesson = await prisma.lesson.create({
			data: {
				...validatedData,
				moduleId: moduleId,
			},
		});

		const responseData = LessonSchema.LESSON_MODEL.parse(newLesson);
		return responseData;
	};

	static updateLesson = async (lessonId: string, validatedData: any) => {
		const existingLesson = await prisma.lesson.findUnique({
			where: { id: lessonId },
		});
		if (!existingLesson)
			throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");

		const updatedLesson = await prisma.lesson.update({
			where: { id: lessonId },
			data: validatedData,
		});

		return LessonSchema.LESSON_MODEL.parse(updatedLesson);
	};

	static deleteLesson = async (lessonId: string) => {
		const existingLesson = await prisma.lesson.findUnique({
			where: { id: lessonId },
		});
		if (!existingLesson)
			throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");

		// Menghapus lesson akan memicu Cascade Delete ke Material, Question, Option, dan UserProgress
		await prisma.lesson.delete({ where: { id: lessonId } });
	};

	static upsertMaterial = async (
		lessonId: string,
		validatedData: UpdateMaterialRequest,
	): Promise<MaterialResponse> => {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: lessonId,
			},
		});
		if (!lesson) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
		}

		if (lesson.type !== LessonTypeEnum.THEORY) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Lesson ini khusus untuk materi. Konten materi hanya bisa ditambahkan pada Lesson dengan tipe THEORY",
			);
		}

		const material = await prisma.material.upsert({
			where: {
				lessonId: lessonId,
			},
			update: validatedData as MaterialUncheckedUpdateInput,
			create: {
				...validatedData,
				lessonId: lessonId,
				content: validatedData.content ?? "Konten belum ditambahkan",
			} as MaterialUncheckedCreateInput,
		});

		const responseData = MaterialSchema.MATERIAL_MODEL.parse(material);
		return responseData;
	};

	static createQuestionWithOption = async (
		lessonId: string,
		validatedData: CreateQuestionWithOptionRequest,
	): Promise<QuestionOptionsResponse> => {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: lessonId,
			},
		});
		if (!lesson) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
		}

		let question;
		if ((validatedData.type === QuestionType.MATCHING || validatedData.type === QuestionType.SORTING || validatedData.type === QuestionType.IMAGE_LABELING) && validatedData.advancedOptions && validatedData.answerPattern) {
			question = await prisma.$transaction(async (tx) => {
				const created = await tx.question.create({
					data: {
						lessonId: lessonId,
						questionText: validatedData.questionText,
						xpReward: validatedData.xpReward ?? 15,
						type: validatedData.type,
					},
				});

				const createdOptions: any[] = [];
				for (const text of validatedData.advancedOptions!) {
					const opt = await tx.option.create({
						data: {
							questionId: created.id,
							optionText: text,
							isCorrect: false,
						}
					});
					createdOptions.push(opt);
				}

				let expectedArray: any[] = [];
				if (validatedData.type === QuestionType.MATCHING) {
					const pattern = validatedData.answerPattern as number[][];
					expectedArray = pattern.map((pair: number[]) => [
						createdOptions[pair[0] as number].id,
						createdOptions[pair[1] as number].id
					]);
				} else {
					const pattern = validatedData.answerPattern as number[];
					expectedArray = pattern.map((idx: number) => createdOptions[idx].id);
				}

				await tx.option.create({
					data: {
						questionId: created.id,
						optionText: JSON.stringify(expectedArray),
						isCorrect: true,
					}
				});

				return await tx.question.findUniqueOrThrow({
					where: { id: created.id },
					include: { options: true }
				});
			});
		} else {
			question = await prisma.question.create({
				data: {
					lessonId: lessonId,
					questionText: validatedData.questionText,
					xpReward: validatedData.xpReward ?? 15,
					type: validatedData.type ?? QuestionType.MULTIPLE_CHOICE,
					options: {
						createMany: {
							data: validatedData.options || [],
						},
					},
				},
				include: {
					options: true,
				},
			});
		}

		const responseData =
			QuestionSchema.QUESTION_OPTIONS_MODEL.parse(question);
		return responseData;
	};

	static updateQuestionWithOption = async (
		questionId: string,
		validatedData: UpdateQuestioWithOptionsRequest, // Ganti dengan tipe data spesifik dari skema Anda
	) => {
		const existingQuestion = await prisma.question.findUnique({
			where: { id: questionId },
		});
		if (!existingQuestion)
			throw new ApiError(StatusCodes.NOT_FOUND, "Soal tidak ditemukan");

		const updatePayload: Prisma.QuestionUpdateInput = {
			questionText:
				validatedData.questionText ?? existingQuestion.questionText,
			// Pastikan properti Prisma Anda adalah xp_reward sesuai skema database
			xpReward: validatedData.xpReward ?? existingQuestion.xpReward,
			type: validatedData.type ?? existingQuestion.type,
		};

		const updatedQuestion = await prisma.$transaction(async (tx) => {
			const updated = await tx.question.update({
				where: { id: questionId },
				data: updatePayload,
				include: {
					options: true,
				},
			});

			if ((validatedData.type === QuestionType.MATCHING || validatedData.type === QuestionType.SORTING || validatedData.type === QuestionType.IMAGE_LABELING) && validatedData.advancedOptions && validatedData.answerPattern) {
				await tx.option.deleteMany({
					where: { questionId: questionId },
				});

				const createdOptions: any[] = [];
				for (const text of validatedData.advancedOptions!) {
					const opt = await tx.option.create({
						data: {
							questionId: questionId,
							optionText: text,
							isCorrect: false,
						}
					});
					createdOptions.push(opt);
				}

				let expectedArray: any[] = [];
				if (validatedData.type === QuestionType.MATCHING) {
					const pattern = validatedData.answerPattern as number[][];
					expectedArray = pattern.map((pair: number[]) => [
						createdOptions[pair[0] as number].id,
						createdOptions[pair[1] as number].id
					]);
				} else {
					const pattern = validatedData.answerPattern as number[];
					expectedArray = pattern.map((idx: number) => createdOptions[idx].id);
				}

				await tx.option.create({
					data: {
						questionId: questionId,
						optionText: JSON.stringify(expectedArray),
						isCorrect: true,
					}
				});
			} else if (validatedData.options && validatedData.options.length > 0) {
				await tx.option.deleteMany({
					where: { questionId: questionId },
				});

				await tx.option.createMany({
					data: validatedData.options.map((opt) => ({
						questionId: questionId,
						optionText: opt.optionText,
						isCorrect: opt.isCorrect,
					})),
				});
			}

			return await tx.question.findUniqueOrThrow({
				where: { id: questionId },
				include: { options: true },
			});
		});

		return QuestionSchema.QUESTION_OPTIONS_MODEL.parse(updatedQuestion);
	};

	static deleteQuestion = async (questionId: string) => {
		const existingQuestion = await prisma.question.findUnique({
			where: { id: questionId },
		});
		if (!existingQuestion)
			throw new ApiError(StatusCodes.NOT_FOUND, "Soal tidak ditemukan");

		await prisma.question.delete({ where: { id: questionId } });
	};
}

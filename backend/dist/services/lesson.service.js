import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import { LessonSchema, } from "../schemas/lesson.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import z from "zod";
import { MaterialSchema, } from "../schemas/material.schema.js";
import { LessonTypeEnum, RoleEnum, } from "../generated/prisma/client.js";
import { QuestionSchema, } from "../schemas/question.schema.js";
export class LessonService {
    static getLessonByModule = async (moduleId) => {
        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
            },
        });
        if (!module) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Module tidak ditemukan!");
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
    static getLessonDetail = async (lessonId, role) => {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId,
            },
            include: {
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
        }
        else {
            return LessonSchema.LESSON_DETAIL_MAHASISWA_RESPONSE.parse(lesson);
        }
    };
    static createLesson = async (moduleId, validatedData) => {
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
    static updateLesson = async (lessonId, validatedData) => {
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
    static deleteLesson = async (lessonId) => {
        const existingLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!existingLesson)
            throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
        // Menghapus lesson akan memicu Cascade Delete ke Material, Question, Option, dan UserProgress
        await prisma.lesson.delete({ where: { id: lessonId } });
    };
    static upsertMaterial = async (lessonId, validatedData) => {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId,
            },
        });
        if (!lesson) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
        }
        if (lesson.type !== LessonTypeEnum.THEORY) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Lesson ini khusus untuk materiKonten materi hanya bisa ditambahkan pada Lesson dengan tipe THEORY");
        }
        const material = await prisma.material.upsert({
            where: {
                lessonId: lessonId,
            },
            update: validatedData,
            create: {
                ...validatedData,
                lessonId: lessonId,
                content: validatedData.content ?? "Konten belum ditambahkan",
            },
        });
        const responseData = MaterialSchema.MATERIAL_MODEL.parse(material);
        return responseData;
    };
    static createQuestionWithOption = async (lessonId, validatedData) => {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId,
            },
        });
        if (!lesson) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Lesson tidak ditemukan");
        }
        if (lesson.type !== LessonTypeEnum.QUIZ) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Lesson ini khusus untuk Materi");
        }
        const question = await prisma.question.create({
            data: {
                lessonId: lessonId,
                questionText: validatedData.questionText,
                xpReward: validatedData.xpReward ?? 15,
                options: {
                    createMany: {
                        data: validatedData.options,
                    },
                },
            },
            include: {
                options: true,
            },
        });
        const responseData = QuestionSchema.QUESTION_OPTIONS_MODEL.parse(question);
        return responseData;
    };
    static updateQuestionWithOption = async (questionId, validatedData) => {
        const existingQuestion = await prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!existingQuestion)
            throw new ApiError(StatusCodes.NOT_FOUND, "Soal tidak ditemukan");
        const updatePayload = {
            questionText: validatedData.questionText ?? existingQuestion.questionText,
            // Pastikan properti Prisma Anda adalah xp_reward sesuai skema database
            xpReward: validatedData.xpReward ?? existingQuestion.xpReward,
        };
        // 3. Modifikasi opsi HANYA jika frontend benar-benar mengirimkan array opsi baru
        if (validatedData.options && validatedData.options.length > 0) {
            updatePayload.options = {
                deleteMany: {}, // Hapus semua opsi lama
                createMany: {
                    data: validatedData.options, // Masukkan set opsi yang baru
                },
            };
        }
        // 4. Eksekusi pembaruan
        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: updatePayload,
            include: { options: true },
        });
        return QuestionSchema.QUESTION_OPTIONS_MODEL.parse(updatedQuestion);
    };
    static deleteQuestion = async (questionId) => {
        const existingQuestion = await prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!existingQuestion)
            throw new ApiError(StatusCodes.NOT_FOUND, "Soal tidak ditemukan");
        await prisma.question.delete({ where: { id: questionId } });
    };
}
//# sourceMappingURL=lesson.service.js.map
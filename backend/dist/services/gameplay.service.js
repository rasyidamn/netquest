import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import { ApiError } from "../utils/api-error.util.js";
import { LessonTypeEnum, ProgressStatusEnum, } from "../generated/prisma/enums.js";
export class GameplayService {
    static theoryDone = async (userId, lessonId) => {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId,
            },
            include: {
                module: true,
            },
        });
        if (!lesson) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Pelajaran tidak ditemukan");
        }
        if (lesson.type !== LessonTypeEnum.THEORY) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Endpoint ini khusus untuk lesson dengan type theory");
        }
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        });
        if (existingProgress?.status === ProgressStatusEnum.COMPLETED) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Anda sudah menyelsaikan materi ini!");
        }
        const result = await prisma.$transaction(async (tx) => {
            // MENANDAI LESSON COMPLETED
            await tx.userProgress.update({
                where: {
                    userId_lessonId: {
                        userId: userId,
                        lessonId: lessonId,
                    },
                },
                data: {
                    status: ProgressStatusEnum.COMPLETED,
                },
            });
            // MEMBUKA LESSON SELANJUTNYA
            this.unlockNextLesson(tx, userId, lesson);
            // Perhitungan xp
            const user = await tx.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
            });
            const newTotalXp = user.xp + lesson.xpReward;
            await tx.user.update({
                where: {
                    id: userId,
                },
                data: {
                    xp: newTotalXp,
                },
            });
            return {
                addedXp: lesson.xpReward,
                currentTotalXp: newTotalXp,
            };
        });
        return result;
    };
    static submitQuiz = async (userId, validatedData) => {
        const currentUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        if (currentUser.hearts <= 0) {
            throw new ApiError(StatusCodes.FORBIDDEN, "Nyawa sudah habis!");
        }
        const option = await prisma.option.findUnique({
            where: {
                id: validatedData.optionId,
            },
            include: {
                question: true,
            },
        });
        if (!option ||
            option.questionId !== validatedData.questionId ||
            option.question.lessonId !== validatedData.lessondId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Data pertanyaan atau opsi tidak valid");
        }
        const result = await prisma.$transaction(async (tx) => {
            let addedXp = 0;
            let currentTotalXp = currentUser.xp;
            let currentHearts = currentUser.hearts;
            if (option.isCorrect) {
                addedXp = option.question.xpReward;
                currentTotalXp = currentUser.xp + addedXp;
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        xp: currentTotalXp,
                    },
                });
            }
            else {
                currentHearts = Math.max(0, currentUser.hearts - 1);
                await tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        hearts: currentHearts,
                        heartsUpdatedAt: currentHearts === 0
                            ? new Date()
                            : currentUser.heartsUpdatedAt,
                    },
                });
            }
            return {
                isCorrect: option.isCorrect,
                addedXp: addedXp,
                currentTotalXp: currentTotalXp,
                heartsLeft: currentHearts,
            };
        });
        return result;
    };
    static completeQuiz = async (userId, validatedData) => {
        // 1. Validasi Lesson & Module
        const lesson = await prisma.lesson.findUnique({
            where: { id: validatedData.lessonId },
            include: { module: true },
        });
        if (!lesson || lesson.type !== LessonTypeEnum.QUIZ) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Pelajaran tidak ditemukan atau bukan tipe kuis.");
        }
        // 2. Eksekusi Transaksi
        const result = await prisma.$transaction(async (tx) => {
            // A. Cari progress kuis saat ini untuk membandingkan skor
            const currentProgress = await tx.userProgress.findUnique({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId: validatedData.lessonId,
                    },
                },
            });
            // B. Simpan skor tertinggi (Jika ngulang kuis dan nilainya lebih kecil, jangan ditimpa)
            const previousScore = currentProgress?.bestScore || 0;
            const newBestScore = Math.max(previousScore, validatedData.finalScore);
            // C. Tandai Kuis COMPLETED & Update Skor
            await tx.userProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId: validatedData.lessonId,
                    },
                },
                update: {
                    status: ProgressStatusEnum.COMPLETED,
                    bestScore: newBestScore,
                },
                create: {
                    userId: userId,
                    lessonId: validatedData.lessonId,
                    status: ProgressStatusEnum.COMPLETED,
                    bestScore: newBestScore,
                },
            });
            // D. BUKA GEMBOK MATERI/MODUL SELANJUTNYA!
            // (Kita gunakan helper function yang sudah kita buat sebelumnya)
            const nextLesson = await GameplayService.unlockNextLesson(tx, userId, lesson);
            return {
                isNewBestScore: validatedData.finalScore > previousScore,
                bestScore: newBestScore,
                nextLessonId: nextLesson?.id || null,
            };
        });
        return result;
    };
    static recoverHeart = async (userId, validatedData) => {
        const currentUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastRecovery = new Date(currentUser.lastRecoveryDate);
        lastRecovery.setHours(0, 0, 0, 0);
        const isSameDay = today.getTime() === lastRecovery.getTime();
        let currentRecoveryCount = isSameDay ? currentUser.recoveryCount : 0;
        if (currentRecoveryCount >= 3) {
            throw new ApiError(StatusCodes.FORBIDDEN, "Batas harian tercapai!");
        }
        const lesson = await prisma.lesson.findUnique({
            where: { id: validatedData.lessonId },
        });
        if (!lesson || lesson.type !== LessonTypeEnum.THEORY) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Hanya materi teori yang valid!");
        }
        const newHeart = Math.min(3, currentUser.hearts + 1);
        await prisma.user.update({
            where: { id: userId },
            data: {
                hearts: newHeart,
                heartsUpdatedAt: newHeart === 3 ? new Date() : currentUser.heartsUpdatedAt,
                recoveryCount: currentRecoveryCount + 1,
                lastRecoveryDate: new Date(),
            },
        });
        return {
            recovered: 1,
            heartsLeft: newHeart,
            remainingDailyQuota: 3 - (currentRecoveryCount + 1),
        };
    };
    static unlockNextLesson = async (tx, userId, currentLesson) => {
        let nextLesson = await tx.lesson.findFirst({
            where: {
                moduleId: currentLesson.moduleId,
                lessonSequence: currentLesson.lessonSequence + 1,
            },
        });
        if (!nextLesson) {
            // Cari modul yang urutannya 1 tingkat di atas modul saat ini
            const nextModule = await tx.module.findFirst({
                where: { sequence: currentLesson.module.sequence + 1 },
            });
            // Jika modul berikutnya ada, ambil materi urutan PERTAMA di modul tersebut
            if (nextModule) {
                nextLesson = await tx.lesson.findFirst({
                    where: { moduleId: nextModule.id },
                    orderBy: { lessonSequence: "asc" }, // Ambil yang paling awal
                });
            }
        }
        if (nextLesson) {
            await tx.userProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: userId,
                        lessonId: nextLesson.id,
                    },
                },
                update: {}, // Jika sudah terbuka, biarkan saja (aman dari error)
                create: {
                    userId: userId,
                    lessonId: nextLesson.id,
                    status: ProgressStatusEnum.ACTIVE,
                },
            });
        }
        return nextLesson;
    };
}
//# sourceMappingURL=gameplay.service.js.map
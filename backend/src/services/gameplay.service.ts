import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import { ApiError } from "../utils/api-error.util.js";
import {
	LessonTypeEnum,
	ProgressStatusEnum,
	QuestionType,
} from "../generated/prisma/enums.js";
import type {
	CompleteQuizRequest,
	RecoverHeartRequest,
	SubmitAnswerRequest,
} from "../schemas/gameplay.schema.js";
import type { LessonWithModule } from "../schemas/lesson.schema.js";

export class GameplayService {
	/**
	 * Sinkronisasi nyawa berdasarkan cooldown (Lazy Evaluation).
	 * Dipanggil sebelum operasi apapun yang memerlukan data nyawa yang akurat.
	 * Cooldown: 30 menit per 1 nyawa.
	 */
	static syncUserHearts = async (userId: string) => {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user || user.hearts >= 3) return user;

		const now = new Date();
		const diffMs = now.getTime() - user.heartsUpdatedAt.getTime();
		const cooldownPeriod = 3 * 60 * 1000; // 30 menit
		const heartsToRecover = Math.floor(diffMs / cooldownPeriod);

		if (heartsToRecover <= 0) return user;

		const newHearts = Math.min(3, user.hearts + heartsToRecover);
		const newUpdatedAt = new Date(
			user.heartsUpdatedAt.getTime() + heartsToRecover * cooldownPeriod,
		);

		return prisma.user.update({
			where: { id: userId },
			data: {
				hearts: newHearts,
				heartsUpdatedAt: newHearts === 3 ? now : newUpdatedAt,
			},
		});
	};

	static theoryDone = async (userId: string, lessonId: string) => {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: lessonId,
			},
			include: {
				module: true,
			},
		});
		if (!lesson) {
			throw new ApiError(
				StatusCodes.NOT_FOUND,
				"Pelajaran tidak ditemukan",
			);
		}
		if (lesson.type !== LessonTypeEnum.THEORY) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Endpoint ini khusus untuk lesson dengan type theory",
			);
		}

		const existingProgress = await prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId,
				},
			},
		});

		// Bug Fix: Jika record tidak ada sama sekali, lempar 403 (bukan crash P2025)
		if (!existingProgress) {
			throw new ApiError(
				StatusCodes.FORBIDDEN,
				"Anda belum membuka materi ini.",
			);
		}

		if (existingProgress.status === ProgressStatusEnum.COMPLETED) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Anda sudah menyelsaikan materi ini!",
			);
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

			// MEMBUKA LESSON SELANJUTNYA — Bug Fix: harus di-await!
			// Tanpa await, tx sudah commit sebelum unlockNextLesson selesai → tx invalid
			await this.unlockNextLesson(tx, userId, lesson);

			// Perhitungan xp
			const user = await tx.user.findUnique({
				where: {
					id: userId,
				},
			});
			if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Sesi tidak valid. Silakan login kembali.");

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

	static submitQuiz = async (
		userId: string,
		validatedData: SubmitAnswerRequest,
	) => {
		// Fail-Safe: Sinkronisasi nyawa berdasarkan cooldown sebelum cek apapun
		const currentUser = await GameplayService.syncUserHearts(userId);
		if (!currentUser) throw new ApiError(StatusCodes.UNAUTHORIZED, "Sesi tidak valid. Silakan login kembali.");

		if (currentUser.hearts <= 0) {
			throw new ApiError(StatusCodes.FORBIDDEN, "Nyawa sudah habis!");
		}

		const question = await prisma.question.findUnique({
			where: {
				id: validatedData.questionId,
			},
			include: { options: true },
		});

		if (!question || question.lessonId !== validatedData.lessonId) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Data pertanyaan tidak valid atau tidak cocok dengan materi saat ini.",
			);
		}

		let isAnswerCorrect = false;

		switch (question.type) {
			case QuestionType.MULTIPLE_CHOICE:
				const selectedOption = question.options.find(
					(opt) => opt.id === validatedData.answer,
				);
				if (selectedOption && selectedOption.isCorrect) {
					isAnswerCorrect = true;
				}
				break;

			case QuestionType.COMMAND_TYPING:
			case QuestionType.CALCULATION_INPUT:
				const correctTextOption = question.options.find(
					(opt) => opt.isCorrect,
				);
				if (correctTextOption) {
					// Normalisasi: hilangkan spasi berlebih di awal/akhir dan ubah ke huruf kecil
					const expectedText = correctTextOption.optionText
						.trim()
						.toLowerCase();
					const submittedText = validatedData.answer
						.trim()
						.toLowerCase();

					if (expectedText === submittedText) {
						isAnswerCorrect = true;
					}
				}
				break;

			case QuestionType.SORTING:
			case QuestionType.MATCHING:
			case QuestionType.IMAGE_LABELING:
				// Mode JSON Array: Frontend mengirimkan stringified array
				const correctSortOption = question.options.find(
					(opt) => opt.isCorrect,
				);
				if (correctSortOption) {
					try {
						// Parsing jawaban frontend dan database untuk memastikan strukturnya sama persis
						const expectedArray = JSON.parse(
							correctSortOption.optionText,
						);
						const submittedArray = JSON.parse(validatedData.answer);

						// Cara instan membandingkan dua array string di JavaScript
						if (
							JSON.stringify(expectedArray) ===
							JSON.stringify(submittedArray)
						) {
							isAnswerCorrect = true;
						}
					} catch (error) {
						throw new ApiError(
							StatusCodes.BAD_REQUEST,
							"Format array jawaban tidak valid.",
						);
					}
				}
				break;

			default:
				throw new ApiError(
					StatusCodes.NOT_IMPLEMENTED,
					"Tipe kuis ini belum didukung.",
				);
		}

		const currentProgress = await prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId: validatedData.lessonId,
				},
			},
		});

		const isAlreadyCompleted = currentProgress?.status === ProgressStatusEnum.COMPLETED;

		const result = await prisma.$transaction(async (tx) => {
			let addedXp = 0;
			let currentHearts = currentUser.hearts;

			if (isAnswerCorrect) {
				// Frontend akan menyimpan XP ini sementara di memory (Zustand)
				// Tetap kembalikan addedXp = 0 jika kuis sudah completed (anti farming)
				addedXp = isAlreadyCompleted ? 0 : question.xpReward;
			} else {
				// Jika salah dan belum completed, langsung kurangi nyawa di database
				if (!isAlreadyCompleted) {
					currentHearts = Math.max(0, currentUser.hearts - 1);
					await tx.user.update({
						where: { id: userId },
						data: {
							hearts: currentHearts,
							heartsUpdatedAt:
								currentUser.hearts === 3
									? new Date() // Mulai timer dari detik ini jika sebelumnya penuh
									: currentUser.heartsUpdatedAt, // Lanjutkan progress timer jika sudah berjalan
						},
					});
				}
			}

			return {
				isCorrect: isAnswerCorrect,
				addedXp: addedXp,
				heartsLeft: currentHearts,
				questionType: question.type, // Kirim tipe kuis ke frontend sebagai metadata opsional
			};
		});

		return result;
	};

	static completeQuiz = async (
		userId: string,
		validatedData: CompleteQuizRequest,
	) => {
		const lesson = await prisma.lesson.findUnique({
			where: { id: validatedData.lessonId },
			include: { module: true },
		});

		if (!lesson || lesson.type !== "QUIZ") {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Pelajaran tidak valid.",
			);
		}

		const result = await prisma.$transaction(async (tx) => {
			// 1. Cek User
			const currentUser = await tx.user.findUnique({
				where: { id: userId },
			});
			if (!currentUser)
				throw new ApiError(
					StatusCodes.NOT_FOUND,
					"User tidak ditemukan",
				);

			// 2. Cek Progres Saat Ini
			const currentProgress = await tx.userProgress.findUnique({
				where: {
					userId_lessonId: {
						userId,
						lessonId: validatedData.lessonId,
					},
				},
			});

			const isAlreadyCompleted = currentProgress?.status === ProgressStatusEnum.COMPLETED;
			let addedXp = 0;

			// 3. INJEKSI XP KE PROFIL (Hanya jika belum pernah selesai)
			if (!isAlreadyCompleted) {
				addedXp = lesson.xpReward;
				await tx.user.update({
					where: { id: userId },
					data: { xp: { increment: addedXp } },
				});
			}

			// 4. Upsert Status Selesai
			await tx.userProgress.upsert({
				where: {
					userId_lessonId: {
						userId,
						lessonId: validatedData.lessonId,
					},
				},
				update: {
					status: ProgressStatusEnum.COMPLETED,
					bestScore: lesson.xpReward, // bestScore disamakan dengan xpReward kuis
				},
				create: {
					userId,
					lessonId: validatedData.lessonId,
					status: ProgressStatusEnum.COMPLETED,
					bestScore: lesson.xpReward,
				},
			});

			// Tarik total XP terbaru
			const updatedUser = await tx.user.findUnique({
				where: { id: userId },
			});

			// 5. Buka Gembok Modul Selanjutnya (Await bug fix as well)
			const nextLesson = await GameplayService.unlockNextLesson(
				tx,
				userId,
				lesson,
			);

			// Menghitung apakah user naik level (contoh sederhana kelipatan 500)
			const oldLevel = Math.floor(currentUser.xp / 500);
			const newLevel = Math.floor((updatedUser?.xp || 0) / 500);
			const isLevelUp = newLevel > oldLevel;

			return {
				sessionScore: addedXp, // score yang didapat dari sesi ini
				newTotalXp: updatedUser?.xp || 0,
				isLevelUp,
				nextLessonId: nextLesson?.id || null,
			};
		});

		return result;
	};

	static recoverHeart = async (
		userId: string,
		validatedData: RecoverHeartRequest,
	) => {
		const currentUser = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!currentUser) throw new ApiError(StatusCodes.UNAUTHORIZED, "Sesi tidak valid. Silakan login kembali.");

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
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Hanya materi teori yang valid!",
			);
		}

		const newHeart = Math.min(3, currentUser.hearts + 1);

		await prisma.user.update({
			where: { id: userId },
			data: {
				hearts: newHeart,
				heartsUpdatedAt:
					newHeart === 3 ? new Date() : currentUser.heartsUpdatedAt,
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

	static unlockNextLesson = async (
		tx: any,
		userId: string,
		currentLesson: LessonWithModule,
	) => {
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

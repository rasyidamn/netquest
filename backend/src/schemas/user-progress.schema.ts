// src/schemas/user-progress.schema.ts
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ProgressStatusEnum } from "../generated/prisma/enums.js"; // Sesuaikan path enum

extendZodWithOpenApi(z);

export class UserProgressSchema {
	// 1. Model Dasar
	static readonly USER_PROGRESS_MODEL = z.object({
		id: z
			.uuid()
			.openapi({ example: "55555555-6666-7777-8888-999999999999" }),
		userId: z
			.uuid("Format User ID tidak valid")
			.openapi({ example: "cc0f6a91-95dd-498e-b148-dd231d2664fb" }),

		lessonId: z
			.uuid("Format Current Lesson ID tidak valid")
			.openapi({ example: "11111111-2222-3333-4444-555555555555" }),
		status: z.enum(ProgressStatusEnum).openapi({ example: "LOCKED" }),
		bestScore: z
			.number()
			.int()
			.nonnegative("Skor tidak boleh kurang dari 0")
			.openapi({ example: 85 }),
	});

	// 2. Skema Create (Membuat progres baru)
	// Secara default, status akan 'LOCKED' dan bestScore '0' dari database,
	// jadi kita bisa membuat status dan bestScore menjadi opsional saat 'create'
	static readonly CREATE_USER_PROGRESS_REQUEST =
		this.USER_PROGRESS_MODEL.omit({
			id: true,
		})
			.extend({
				status: z.enum(ProgressStatusEnum).optional(),
				bestScore: z.number().int().nonnegative().optional(),
			})
			.strict();

	// 3. Skema Update (Misal: mahasiswa selesai kuis, update skor dan statusnya)
	static readonly UPDATE_USER_PROGRESS_REQUEST =
		this.CREATE_USER_PROGRESS_REQUEST.partial().strict();

	// 4. Skema URL Parameter
	static readonly USER_PROGRESS_ID_PARAM = z.object({
		id: z.uuid("Format ID progress tidak valid!"),
	});
}

// Export tipe data untuk digunakan di Service dan Controller
export type CreateUserProgressRequest = z.infer<
	typeof UserProgressSchema.CREATE_USER_PROGRESS_REQUEST
>;
export type UpdateUserProgressRequest = z.infer<
	typeof UserProgressSchema.UPDATE_USER_PROGRESS_REQUEST
>;
export type UserProgressResponse = z.infer<
	typeof UserProgressSchema.USER_PROGRESS_MODEL
>;

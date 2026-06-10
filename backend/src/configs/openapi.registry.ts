// src/configs/openapi.registry.ts

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "../schemas/user.schema.js";
import { ModuleSchema } from "../schemas/module.schema.js";
import { LessonSchema } from "../schemas/lesson.schema.js";
import { MaterialSchema } from "../schemas/material.schema.js";
import { QuestionSchema } from "../schemas/question.schema.js";
import { GameplaySchema } from "../schemas/gameplay.schema.js";
import { UserProgressSchema } from "../schemas/user-progress.schema.js";
import { LeaderboardSchema } from "../schemas/leaderboard.schema.js";

export const registry = new OpenAPIRegistry();

// ============================================================
// 1. Security Schemes (JWT Bearer Auth)
// ============================================================
registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

// ============================================================
// 2. Register Zod Schemas (so they appear in OpenAPI models)
// ============================================================
registry.register("RegisterRequest", UserSchema.REGISTER_REQUEST);
registry.register("RegisterResponse", UserSchema.REGISTER_RESPONSE);
registry.register("LoginRequest", UserSchema.LOGIN_REQUEST);
registry.register("LoginResponse", UserSchema.LOGIN_RESPONSE);
registry.register("GetProfileResponse", UserSchema.GET_PROFILE_RESPONSE);
registry.register("ModuleModel", ModuleSchema.MODULE_MODEL);
registry.register("CreateModuleRequest", ModuleSchema.CREATE_MODULE_REQUEST);
registry.register("UpdateModuleRequest", ModuleSchema.UPDATE_MODULE_REQUEST);
registry.register("LessonModel", LessonSchema.LESSON_MODEL);
registry.register("CreateLessonRequest", LessonSchema.CREATE_LESSON_REQUEST);
registry.register("UpdateLessonRequest", LessonSchema.UPDATE_LESSON_REQUEST);
registry.register("LessonDetailAdmin", LessonSchema.LESSON_DETAIL_ADMIN_RESPONSE);
registry.register("LessonDetailMahasiswa", LessonSchema.LESSON_DETAIL_MAHASISWA_RESPONSE);
registry.register("MaterialModel", MaterialSchema.MATERIAL_MODEL);
registry.register("CreateMaterialRequest", MaterialSchema.CREATE_MATERIAL_REQUEST);
registry.register("UpdateMaterialRequest", MaterialSchema.UPDATE_MATERIAL_REQUEST);
registry.register("CreateQuestionWithOptions", QuestionSchema.CREATE_QUESTION_WITH_OPTIONS_REQUEST);
registry.register("UpdateQuestionWithOptions", QuestionSchema.UPDATE_QUESTION_WITH_OPTIONS_REQUEST);
registry.register("QuestionModel", QuestionSchema.QUESTION_MODEL);
registry.register("SubmitAnswerRequest", GameplaySchema.SUBMIT_ANSWER_REQUEST);
registry.register("CompleteQuizRequest", GameplaySchema.COMPLETE_QUIZ_REQUEST);
registry.register("RecoverHeartRequest", GameplaySchema.RECOVER_HEART_REQUEST);
registry.register("UserProgressModel", UserProgressSchema.USER_PROGRESS_MODEL);
registry.register("LeaderboardItem", LeaderboardSchema.LEADERBOARD_ITEM);
registry.register("LeaderboardResponse", LeaderboardSchema.LEADERBOARD_RESPONSE);

// ============================================================
// 3. Endpoints — AUTH
// ============================================================

registry.registerPath({
	method: "post",
	path: "/api/auth/register",
	summary: "Mendaftarkan mahasiswa baru",
	description: "Mendaftarkan akun mahasiswa baru dengan NIM, nama, dan password.",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UserSchema.REGISTER_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil mendaftar akun",
			content: {
				"application/json": {
					schema: UserSchema.REGISTER_RESPONSE,
				},
			},
		},
		400: { description: "Validasi input gagal (NIM sudah terdaftar, format salah, dll)" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/auth/login",
	summary: "Login user",
	description: "Login menggunakan NIM dan password untuk mendapatkan access token.",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UserSchema.LOGIN_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Berhasil login! Mengembalikan data user dan access token.",
			content: {
				"application/json": {
					schema: UserSchema.LOGIN_RESPONSE,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "NIM atau password salah" },
	},
});

registry.registerPath({
	method: "get",
	path: "/api/auth/profile",
	summary: "Mengambil data profile user",
	description: "Mengambil data profile lengkap user yang sedang login. Memerlukan token JWT.",
	tags: ["Auth"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Berhasil mengambil data profile user",
			content: {
				"application/json": {
					schema: UserSchema.GET_PROFILE_RESPONSE,
				},
			},
		},
		401: { description: "Token tidak valid atau tidak disertakan" },
	},
});

// ============================================================
// 4. Endpoints — MODULES
// ============================================================

registry.registerPath({
	method: "get",
	path: "/api/modules",
	summary: "Mendapatkan semua modul",
	description: "Mengambil daftar semua modul pembelajaran. Memerlukan token JWT.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Berhasil mengambil daftar modul",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/ModuleModel" },
					},
				},
			},
		},
		401: { description: "Token tidak valid atau tidak disertakan" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/modules",
	summary: "Membuat modul baru (Admin)",
	description: "Menambahkan modul pembelajaran baru. Hanya untuk admin.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: ModuleSchema.CREATE_MODULE_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil membuat modul baru",
			content: {
				"application/json": {
					schema: ModuleSchema.MODULE_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
	},
});

registry.registerPath({
	method: "patch",
	path: "/api/modules/{id}",
	summary: "Memperbarui modul (Admin)",
	description: "Memperbarui data modul berdasarkan ID. Hanya untuk admin.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	request: {
		params: ModuleSchema.MODULE_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: ModuleSchema.UPDATE_MODULE_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Berhasil memperbarui modul",
			content: {
				"application/json": {
					schema: ModuleSchema.MODULE_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Modul tidak ditemukan" },
	},
});

registry.registerPath({
	method: "delete",
	path: "/api/modules/{id}",
	summary: "Menghapus modul (Admin)",
	description: "Menghapus modul berdasarkan ID. Hanya untuk admin.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	request: {
		params: ModuleSchema.MODULE_ID_PARAM,
	},
	responses: {
		200: { description: "Berhasil menghapus modul" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Modul tidak ditemukan" },
	},
});

registry.registerPath({
	method: "get",
	path: "/api/modules/{id}/lessons",
	summary: "Mendapatkan lesson dalam modul",
	description: "Mengambil daftar lesson (materi/kuis) yang berada dalam suatu modul. Memerlukan token JWT.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	request: {
		params: ModuleSchema.MODULE_ID_PARAM,
	},
	responses: {
		200: {
			description: "Berhasil mengambil daftar lesson",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/LessonModel" },
					},
				},
			},
		},
		401: { description: "Token tidak valid" },
		404: { description: "Modul tidak ditemukan" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/modules/{id}/lessons",
	summary: "Menambahkan lesson ke modul (Admin)",
	description: "Menambahkan lesson baru ke dalam modul tertentu. Hanya untuk admin.",
	tags: ["Modules"],
	security: [{ bearerAuth: [] }],
	request: {
		params: ModuleSchema.MODULE_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: LessonSchema.CREATE_LESSON_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil menambahkan lesson",
			content: {
				"application/json": {
					schema: LessonSchema.LESSON_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Modul tidak ditemukan" },
	},
});

// ============================================================
// 5. Endpoints — LESSONS
// ============================================================

registry.registerPath({
	method: "get",
	path: "/api/lessons/{id}",
	summary: "Mendapatkan detail lesson",
	description: "Mengambil detail lesson berdasarkan ID. Admin mendapat data termasuk kunci jawaban, mahasiswa mendapat data tanpa kunci jawaban.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
	},
	responses: {
		200: {
			description: "Berhasil mengambil detail lesson",
			content: {
				"application/json": {
					schema: LessonSchema.LESSON_DETAIL_MAHASISWA_RESPONSE,
				},
			},
		},
		401: { description: "Token tidak valid" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/lessons",
	summary: "Membuat lesson baru (Admin)",
	description: "Menambahkan lesson baru. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: LessonSchema.CREATE_LESSON_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil membuat lesson",
			content: {
				"application/json": {
					schema: LessonSchema.LESSON_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
	},
});

registry.registerPath({
	method: "put",
	path: "/api/lessons/{id}",
	summary: "Memperbarui lesson (Admin)",
	description: "Memperbarui data lesson berdasarkan ID. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: LessonSchema.UPDATE_LESSON_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Berhasil memperbarui lesson",
			content: {
				"application/json": {
					schema: LessonSchema.LESSON_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

registry.registerPath({
	method: "delete",
	path: "/api/lessons/{id}",
	summary: "Menghapus lesson (Admin)",
	description: "Menghapus lesson berdasarkan ID. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
	},
	responses: {
		200: { description: "Berhasil menghapus lesson" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

// ============================================================
// 6. Endpoints — LESSON MATERIAL & QUESTIONS (Admin)
// ============================================================

registry.registerPath({
	method: "post",
	path: "/api/lessons/{id}/material",
	summary: "Menambahkan materi ke lesson (Admin)",
	description: "Menambahkan materi pembelajaran (teks/media) ke dalam lesson tipe THEORY. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: MaterialSchema.CREATE_MATERIAL_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil menambahkan materi",
			content: {
				"application/json": {
					schema: MaterialSchema.MATERIAL_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

registry.registerPath({
	method: "put",
	path: "/api/lessons/{id}/material",
	summary: "Memperbarui materi lesson (Admin)",
	description: "Memperbarui materi pembelajaran dalam lesson tipe THEORY. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: MaterialSchema.UPDATE_MATERIAL_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Berhasil memperbarui materi",
			content: {
				"application/json": {
					schema: MaterialSchema.MATERIAL_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Lesson atau materi tidak ditemukan" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/lessons/{id}/questions",
	summary: "Menambahkan soal kuis ke lesson (Admin)",
	description: "Menambahkan soal kuis beserta pilihan jawaban ke dalam lesson tipe QUIZ. Hanya untuk admin.",
	tags: ["Lessons"],
	security: [{ bearerAuth: [] }],
	request: {
		params: LessonSchema.LESSON_ID_PARAM,
		body: {
			content: {
				"application/json": {
					schema: QuestionSchema.CREATE_QUESTION_WITH_OPTIONS_REQUEST,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Berhasil menambahkan soal kuis",
			content: {
				"application/json": {
					schema: QuestionSchema.QUESTION_MODEL,
				},
			},
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

// ============================================================
// 7. Endpoints — GAMEPLAY
// ============================================================

registry.registerPath({
	method: "post",
	path: "/api/gameplay/theory-done",
	summary: "Menyelesaikan lesson teori",
	description: "Menandai bahwa mahasiswa telah selesai membaca materi teori. Memberikan XP +10 dan memperbarui progress. Memerlukan token JWT.",
	tags: ["Gameplay"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: LessonSchema.LESSON_ID_PARAM,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Berhasil menyelesaikan teori. Mengembalikan data progress terbaru.",
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
		404: { description: "Lesson tidak ditemukan" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/gameplay/submit-quiz",
	summary: "Menjawab soal kuis",
	description: "Mengirimkan jawaban untuk satu soal kuis. Jika benar (+15 XP), jika salah (-1 nyawa). Memerlukan token JWT.",
	tags: ["Gameplay"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: GameplaySchema.SUBMIT_ANSWER_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Jawaban terkirim. Mengembalikan status benar/salah, skor, dan sisa nyawa.",
		},
		400: { description: "Validasi input gagal atau nyawa habis" },
		401: { description: "Token tidak valid" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/gameplay/complete-quiz",
	summary: "Menyelesaikan seluruh kuis",
	description: "Menandai bahwa mahasiswa telah selesai mengerjakan seluruh soal dalam lesson QUIZ. Memperbarui progress lesson menjadi COMPLETED. Memerlukan token JWT.",
	tags: ["Gameplay"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: GameplaySchema.COMPLETE_QUIZ_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Kuis diselesaikan, progres belajar diperbarui.",
		},
		400: { description: "Validasi input gagal" },
		401: { description: "Token tidak valid" },
	},
});

registry.registerPath({
	method: "post",
	path: "/api/gameplay/recover-heart",
	summary: "Memulihkan nyawa",
	description: "Memulihkan nyawa yang hilang dengan membaca materi teori selama durasi tertentu (minimal 60 detik). Memerlukan token JWT.",
	tags: ["Gameplay"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: GameplaySchema.RECOVER_HEART_REQUEST,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Nyawa berhasil dipulihkan. Mengembalikan sisa nyawa saat ini.",
		},
		400: { description: "Validasi input gagal (durasi kurang dari 60 detik)" },
		401: { description: "Token tidak valid" },
	},
});

// ============================================================
// 8. Endpoints — PROGRESS
// ============================================================

registry.registerPath({
	method: "get",
	path: "/api/progress",
	summary: "Mendapatkan progress pribadi",
	description: "Mengambil data progress belajar mahasiswa yang sedang login. Memerlukan token JWT.",
	tags: ["Progress"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Berhasil mengambil data progress",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/UserProgressModel" },
					},
				},
			},
		},
		401: { description: "Token tidak valid" },
	},
});

registry.registerPath({
	method: "get",
	path: "/api/progress/all",
	summary: "Mendapatkan semua progress mahasiswa (Admin)",
	description: "Mengambil data progress seluruh mahasiswa. Hanya untuk admin.",
	tags: ["Progress"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Berhasil mengambil semua data progress",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/UserProgressModel" },
					},
				},
			},
		},
		401: { description: "Token tidak valid" },
		403: { description: "Forbidden — hanya admin" },
	},
});

// ============================================================
// 9. Endpoints — LEADERBOARD
// ============================================================

registry.registerPath({
	method: "get",
	path: "/api/leaderboard",
	summary: "Mendapatkan papan peringkat",
	description: "Mengambil daftar peringkat mahasiswa berdasarkan XP. Parameter query 'limit' opsional (default 10). Memerlukan token JWT.",
	tags: ["Leaderboard"],
	security: [{ bearerAuth: [] }],
	request: {
		query: LeaderboardSchema.LEADERBOARD_QUERY,
	},
	responses: {
		200: {
			description: "Berhasil mengambil data leaderboard",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/LeaderboardItem" },
					},
				},
			},
		},
		401: { description: "Token tidak valid" },
	},
});
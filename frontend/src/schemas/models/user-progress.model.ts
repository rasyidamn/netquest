import z from "zod";

const ProgressStatusEnum = {
	LOCKED: "LOCKED",
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
};

/**
 * Progress per-modul — sesuai response dari backend API `GET /progress`
 * Backend mengembalikan data agregat per modul, bukan per lesson.
 */
export const UserProgressModel = z.object({
	moduleId: z.string(),
	status: z.enum(ProgressStatusEnum),
	bestScore: z.number().int(),
	currentLessonId: z.string(),
});

import z from "zod";

const ProgressStatusEnum = {
	LOCKED: "LOCKED",
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
};

export const UserProgressModel = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	lessonId: z.uuid(),
	status: z.enum(ProgressStatusEnum),
	bestScore: z.number().int(),
});
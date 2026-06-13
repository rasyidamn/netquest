import z from "zod";

export const questionModel = z.object({
	id: z.uuid(),
	lessonId: z.string(),
	questionText: z.string().min(5),
	xpReward: z.number().int(),
});
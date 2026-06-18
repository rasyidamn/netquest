import z from "zod";

export const QuestionModel = z.object({
	id: z.uuid(),
	lessonId: z.string(),
	questionText: z.string().min(5),
	xpReward: z.number().int(),
});
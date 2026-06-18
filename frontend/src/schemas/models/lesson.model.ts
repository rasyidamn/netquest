import z from "zod";

const LessonTypeEnum = {
	THEORY: "THEORY",
	QUIZ: "QUIZ",
};

export const LessonModel = z.object({
	id: z.uuid(),
	moduleId: z.string(),
	title: z.string().min(3),
	lessonSequence: z.number().int(),
	type: z.enum(LessonTypeEnum),
	xpReward: z.number().int(),
});
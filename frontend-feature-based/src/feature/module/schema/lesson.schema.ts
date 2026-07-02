import z from "zod";
import type { Question } from "./question.schema";
import type { MaterialType } from "./material.schema";
import type { ModuleType } from "./module.schema";

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
	isPublished: z.boolean().default(false),
});

export type LessonType = z.infer<typeof LessonModel>;
export interface LessonDetailType extends LessonType {
	material?: MaterialType;
	questions?: Question[];
	module: ModuleType;
}

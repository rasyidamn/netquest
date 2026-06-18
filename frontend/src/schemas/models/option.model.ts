import z from "zod";

export const OptionModel = z.object({
	id: z.uuid(),
	questionId: z.string(),
	optionText: z.string().min(1),
	isCorrect: z.boolean(),
});
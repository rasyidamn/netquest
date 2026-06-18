import z from "zod";

export const MaterialModel = z.object({
	id: z.uuid(),
	lessonId: z.string(),
	content: z.string().min(10),
	mediaUrl: z.string().url().nullable().optional(),
});
import z from "zod";

export const ModuleModel = z.object({
	id: z.uuid(),
	title: z.string().min(3),
	sequence: z.number().int(),
	isPublished: z.boolean().default(false),
});

export type ModuleType = z.infer<typeof ModuleModel>;

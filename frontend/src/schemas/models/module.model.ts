import z from "zod";

export const moduleModel = z.object({
	id: z.uuid(),
	title: z.string().min(3),
	sequence: z.number().int(),
});
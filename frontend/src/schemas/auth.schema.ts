import z from "zod";
import { userModel } from "./models/user.model";

export const loginSchema = userModel
	.pick({
		nim: true,
		password: true,
	})
	.strict();

export const registerSchema = userModel
	.pick({
		nim: true,
		name: true,
	})
	.extend({
		password: z.string().min(8),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		error: "Password tidak cocok!",
		path: ["passwordConfirm"],
	});

export type loginInput = z.infer<typeof loginSchema>;
export type registerInput = z.infer<typeof registerSchema>;

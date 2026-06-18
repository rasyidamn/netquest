import z from "zod";
import { UserModel } from "./models/user.model";

export const loginSchema = UserModel
	.pick({
		nim: true,
		password: true,
	})
	.strict();

export const registerSchema = UserModel
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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

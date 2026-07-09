import z from "zod";

export const RoleEnum = z.enum(["MAHASISWA", "ADMIN"]);
export type RoleEnumType = z.infer<typeof RoleEnum>;

export const UserModel = z.object({
	id: z.uuid(),
	nim: z.string().length(10),
	name: z.string().min(3),
	password: z.string().min(8),
	role: RoleEnum.optional(),
	xp: z.number().int(),
	hearts: z.number().int(),
	heartsUpdatedAt: z.date(),
	recoveryCount: z.number().int(),
	lastRecoveryDate: z.date(),
	createdAt: z.date(),
});

export const loginSchema = UserModel.pick({
	nim: true,
	password: true,
}).strict();

export const registerSchema = UserModel.pick({
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

export type User = z.infer<typeof UserModel>;
export type UserWithoutPassword = Omit<User, "password">;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

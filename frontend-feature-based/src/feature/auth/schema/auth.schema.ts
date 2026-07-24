import z from "zod";

export const RoleEnum = z.enum(["MAHASISWA", "ADMIN"]);
export type RoleEnumType = z.infer<typeof RoleEnum>;

export const UserModel = z.object({
	id: z.uuid("Format ID tidak valid"),
	nim: z.string({ message: "NIM wajib diisi" }).length(10, "NIM harus tepat 10 karakter"),
	name: z.string({ message: "Nama wajib diisi" }).min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi"),
	password: z.string({ message: "Password wajib diisi" }).min(8, "Password minimal 8 karakter"),
	role: RoleEnum.optional(),
	xp: z.number().int("XP harus berupa angka bulat"),
	hearts: z.number().int("Hearts harus berupa angka bulat"),
	heartsUpdatedAt: z.date({ message: "Format tanggal tidak valid" }),
	recoveryCount: z.number().int("Recovery count harus berupa angka bulat"),
	lastRecoveryDate: z.date({ message: "Format tanggal tidak valid" }),
	createdAt: z.date({ message: "Format tanggal tidak valid" }),
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
		password: z.string({ message: "Password wajib diisi" }).min(8, "Password minimal 8 karakter"),
		passwordConfirm: z.string({ message: "Konfirmasi password wajib diisi" }),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Password tidak cocok!",
		path: ["passwordConfirm"],
	});

export type User = z.infer<typeof UserModel>;
export type UserWithoutPassword = Omit<User, "password">;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

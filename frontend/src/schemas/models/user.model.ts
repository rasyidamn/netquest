import z from "zod";

const RoleEnum = {
	ADMIN: "ADMIN",
	MAHASISWA: "MAHASISWA",
};

export const UserModel = z.object({
		id: z.uuid(),
		nim: z.string().length(10),
		name: z.string().min(3),
		password: z.string().min(8),
		role: z.enum(RoleEnum).optional(),
		xp: z.number().int(),
		hearts: z.number().int(),
		heartsUpdatedAt: z.date(),
		recoveryCount: z.number().int(),
		lastRecoveryDate: z.date(),
		createdAt: z.date(),
	});
import { z } from "zod";
import { RoleEnum } from "@/feature/auth/schema/auth.schema";

export const UserSchema = z.object({
	id: z.string().uuid(),
	nim: z.string().min(5, "NIM terlalu pendek"),
	name: z.string().min(3, "Nama terlalu pendek"),
	role: RoleEnum,
	xp: z.number().int().min(0, "XP tidak boleh negatif"),
	hearts: z.number().int().min(0),
	createdAt: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
	nim: z.string().min(5, "NIM terlalu pendek").optional(),
	name: z.string().min(3, "Nama terlalu pendek").optional(),
	role: RoleEnum.optional(),
	xp: z.number().int().min(0, "XP tidak boleh negatif").optional(),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

export const CreateUserSchema = z.object({
	nim: z.string().min(5, "NIM minimal 5 karakter"),
	name: z.string().min(3, "Nama minimal 3 karakter"),
	role: RoleEnum,
	password: z.string().optional(),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

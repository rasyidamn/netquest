import { z } from "zod";
import { RoleEnum } from "@/feature/auth/schema/auth.schema";

export const UserSchema = z.object({
	id: z.string().uuid("Format ID tidak valid"),
	nim: z.string().length(10, "NIM harus tepat 10 karakter"),
	name: z.string().min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi"),
	role: RoleEnum,
	xp: z.number().int().min(0, "XP tidak boleh negatif"),
	hearts: z.number().int().min(0, "Hearts tidak boleh negatif"),
	createdAt: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
	nim: z.string().length(10, "NIM harus tepat 10 karakter").optional(),
	name: z.string().min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi").optional(),
	role: RoleEnum.optional(),
	xp: z.number().int().min(0, "XP tidak boleh negatif").optional(),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

export const CreateUserSchema = z.object({
	nim: z.string().length(10, "NIM harus tepat 10 karakter"),
	name: z.string().min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi"),
	role: RoleEnum,
	password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

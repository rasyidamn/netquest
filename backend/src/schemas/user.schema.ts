import z from "zod";
import { RoleEnum } from "../generated/prisma/enums.js";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export class UserSchema {
	static readonly USER_MODEL = z.object({
		id: z
			.uuid("Format ID tidak valid")
			.openapi({ example: "cc0f6a91-95dd-498e-b148-dd231d2664fb" }),
		nim: z.string({ message: "NIM wajib diisi" }).length(10, "NIM harus tepat 10 karakter").openapi({ example: "A710220052" }),
		name: z.string({ message: "Nama wajib diisi" }).min(3, "Nama minimal 3 karakter").openapi({ example: "Ilham Rasyidan" }),
		password: z.string({ message: "Password wajib diisi" }).min(8, "Password minimal 8 karakter").openapi({ example: "rahasia123" }),
		role: z.nativeEnum(RoleEnum, { message: "Role tidak valid" }).optional().openapi({ example: "MAHASISWA" }),
		xp: z.number().int("XP harus berupa angka bulat").openapi({ example: 0 }),
		hearts: z.number().int("Hearts harus berupa angka bulat").openapi({ example: 3 }),
		heartsUpdatedAt: z.date({ message: "Format tanggal tidak valid" }),
		recoveryCount: z.number().int("Recovery count harus berupa angka bulat").openapi({ example: 0 }),
		lastRecoveryDate: z.date({ message: "Format tanggal tidak valid" }),
		createdAt: z.date({ message: "Format tanggal tidak valid" }),
	});

	static readonly REGISTER_REQUEST = this.USER_MODEL.pick({
		nim: true,
		name: true,
		password: true,
	}).strict();

	static readonly REGISTER_RESPONSE = this.USER_MODEL.omit({
		password: true,
	}).strict();

	static readonly LOGIN_REQUEST = this.REGISTER_REQUEST.omit({
		name: true,
	}).strict();

	static readonly LOGIN_RESPONSE = z.object({
		user: this.REGISTER_RESPONSE,
	});

	static readonly GET_PROFILE_RESPONSE = this.USER_MODEL.omit({
		password: true,
	});
	static readonly UPDATE_PROFILE_REQUEST = z.object({
		name: z.string().min(3, "Nama minimal 3 karakter").optional(),
		password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
	});

	static readonly CREATE_USER_ADMIN_REQUEST = z.object({
		nim: z.string().length(10, "NIM harus tepat 10 karakter"),
		name: z.string().min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi"),
		role: z.nativeEnum(RoleEnum, { message: "Role tidak valid" }),
		password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
	}).strict();

	static readonly UPDATE_USER_ADMIN_REQUEST = z.object({
		nim: z.string().length(10, "NIM harus tepat 10 karakter").optional(),
		name: z.string().min(3, "Nama minimal 3 karakter").regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh mengandung huruf dan spasi").optional(),
		role: z.nativeEnum(RoleEnum, { message: "Role tidak valid" }).optional(),
		xp: z.number().int("XP harus berupa angka bulat").nonnegative("XP tidak boleh negatif").optional(),
	}).strict();
}

export type UpdateProfileRequest = z.infer<typeof UserSchema.UPDATE_PROFILE_REQUEST>;

export type RegisterRequest = z.infer<typeof UserSchema.REGISTER_REQUEST>;
export type RegisterResponse = z.infer<typeof UserSchema.REGISTER_RESPONSE>;
export type LoginRequest = z.infer<typeof UserSchema.LOGIN_REQUEST>;
export type LoginResponse = z.infer<typeof UserSchema.LOGIN_RESPONSE>;
export type GetProfileResponse = z.infer<
	typeof UserSchema.GET_PROFILE_RESPONSE
>;

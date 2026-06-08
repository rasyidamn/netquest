import { prisma } from "../configs/database.config.js";
import {
	UserSchema,
	type GetProfileResponse,
	type LoginRequest,
	type LoginResponse,
	type RegisterRequest,
	type RegisterResponse,
} from "../schemas/user.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateJWT.util.js";
import { ProgressStatusEnum } from "../generated/prisma/enums.js";

export class AuthService {
	static register = async (
		validatedData: RegisterRequest,
	): Promise<RegisterResponse> => {
		const nimExisting = await prisma.user.findUnique({
			where: {
				nim: validatedData.nim,
			},
		});
		if (nimExisting) {
			throw new ApiError(StatusCodes.BAD_REQUEST, "NIM sudah terdaftar!");
		}

		validatedData.password = await bcrypt.hash(validatedData.password, 10);

		const result = await prisma.$transaction(async (tx) => {
			const newUser = await tx.user.create({
				data: validatedData,
				omit: {
					password: true,
				},
			});

			const firstLesson = await tx.lesson.findFirstOrThrow({
				orderBy: [
					{ module: { sequence: "asc" } },
					{ lessonSequence: "asc" },
				],
			});

			await tx.userProgress.create({
				data: {
					userId: newUser.id,
					lessonId: firstLesson?.id,
					status: ProgressStatusEnum.ACTIVE,
					bestScore: 0,
				},
			});

			return newUser;
		});

		const responseData: RegisterResponse =
			UserSchema.REGISTER_RESPONSE.parse(result);

		return responseData;
	};

	static login = async (
		validatedData: LoginRequest,
	): Promise<LoginResponse> => {
		// nim
		const user = await prisma.user.findUnique({
			where: {
				nim: validatedData.nim,
			},
		});
		if (!user) {
			throw new ApiError(
				StatusCodes.UNAUTHORIZED,
				"NIM atau password salah!",
			);
		}

		// password
		const isPasswordValid = await bcrypt.compare(
			validatedData.password,
			user.password,
		);
		if (!isPasswordValid) {
			throw new ApiError(
				StatusCodes.UNAUTHORIZED,
				"NIM atau password salah!",
			);
		}

		// generate token
		const token = generateToken({
			id: user.id,
			nim: user.nim,
			role: user.role,
		});

		const { password, ...userWithoutPassword } = user;

		const responseData: LoginResponse = UserSchema.LOGIN_RESPONSE.parse({
			user: userWithoutPassword,
			accessToken: token,
		});

		return responseData;
	};

	static getProfile = async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			omit: {
				password: true,
			},
		});
		if (!user) {
			throw new ApiError(StatusCodes.NOT_FOUND, "User tidak ditemukan!");
		}

		// LOGIKA PEMULIHAN HEART SETIAP 4 JAM
		if (user.hearts < 3) {
			const now = new Date();
			const diffInMilliseconds =
				now.getTime() - user.heartsUpdatedAt.getTime();

			// 4 jam = 14.400.000 milidetik
			const cooldownPeriod = 4 * 60 * 60 * 1000;

			const heartsToRecover = Math.floor(
				diffInMilliseconds / cooldownPeriod,
			);

			if (heartsToRecover > 0) {
				const newHearts = Math.min(3, user.hearts + heartsToRecover);

				// Geser waktu update agar sisa waktunya tidak hilang
				const newUpdatedAt = new Date(
					user.heartsUpdatedAt.getTime() +
						heartsToRecover * cooldownPeriod,
				);

				// Update diam-diam di background
				const updatedUser = await prisma.user.update({
					where: { id: userId },
					data: {
						hearts: newHearts,
						heartsUpdatedAt: newHearts === 3 ? now : newUpdatedAt,
					},
				});
				return UserSchema.GET_PROFILE_RESPONSE.parse(updatedUser);
			}
		}

		const responseData = UserSchema.GET_PROFILE_RESPONSE.parse(user);

		return responseData;
	};
}

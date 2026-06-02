import { prisma } from "../configs/database.config.js";
import {
	UserSchema,
	type GetProfileRequest,
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

export class AuthService {
	static readonly register = async (
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

		const newUser = await prisma.user.create({
			data: validatedData,
			omit: {
				password: true,
			},
		});

		const responseData: RegisterResponse =
			UserSchema.REGISTER_RESPONSE.parse(newUser);

		return responseData;
	};

	static readonly login = async (
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

	static readonly getProfile = async (
		validatedData: GetProfileRequest,
	): Promise<GetProfileResponse> => {
		const user = await prisma.user.findUnique({
			where: {
				id: validatedData.id,
			},
			omit: {
				password: true,
			},
		});
		if (!user) {
			throw new ApiError(StatusCodes.NOT_FOUND, "User tidak ditemukan!");
		}

		return user;
	};
}

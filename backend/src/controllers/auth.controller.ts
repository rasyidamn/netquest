import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { UserSchema } from "../schemas/user.schema.js";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../utils/generateJWT.util.js";

export class AuthController {
	static register = catchAsync(async (req: Request, res: Response) => {
		const validatedData = UserSchema.REGISTER_REQUEST.parse(req.body);
		const responseData = await AuthService.register(validatedData);
		sendSuccess(
			res,
			StatusCodes.CREATED,
			"Berhasil mendaftar akun!",
			responseData,
		);
	});

	static login = catchAsync(async (req: Request, res: Response) => {
		const validatedData = UserSchema.LOGIN_REQUEST.parse(req.body);
		const { user } = await AuthService.login(validatedData);

		// generate JWT & set as httpOnly cookie
		const token = generateToken({
			id: user.id,
			nim: user.nim,
			role: user.role!,
		});

		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
		// Parse maxAge from expiresIn string (default 7 days in ms)
		const maxAgeMap: Record<string, number> = {
			"1d": 24 * 60 * 60 * 1000,
			"7d": 7 * 24 * 60 * 60 * 1000,
			"30d": 30 * 24 * 60 * 60 * 1000,
		};
		const maxAge = maxAgeMap[jwtExpiresIn] || 7 * 24 * 60 * 60 * 1000;

		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("access_token", token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
			maxAge,
		});

		sendSuccess(res, StatusCodes.OK, "Berhasil login", { user });
	});

	static logout = catchAsync(async (_req: Request, res: Response) => {
		const isProduction = process.env.NODE_ENV === "production";
		res.clearCookie("access_token", {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
		});
		sendSuccess(res, StatusCodes.OK, "Berhasil logout!", null);
	});

	static getProfile = catchAsync(async (req: Request, res: Response) => {
		const validatedData = req.user?.id as string
		const responseData = await AuthService.getProfile(validatedData);
		sendSuccess(
			res,
			StatusCodes.OK,
			"Berhasil mendapat data profile",
			responseData,
		);
	});
}
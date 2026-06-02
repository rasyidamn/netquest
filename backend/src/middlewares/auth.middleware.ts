import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../utils/generateJWT.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(
			new ApiError(
				StatusCodes.UNAUTHORIZED,
				"Akses ditolak! Token tidak ditemukan.",
			),
		);
	}

	const token = authHeader.split(" ")[1];

	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT_SECRET tidak ditemukan di environment!");
		}

		const decoded = jwt.verify(token as string, secret) as JwtPayload;
		req.user = decoded;

		next();
	} catch (error) {
		return next(
			new ApiError(
				StatusCodes.UNAUTHORIZED,
				"Sesi telah berakhir atau token tidak valid. Silakan login kembali.",
			),
		);
	}
};

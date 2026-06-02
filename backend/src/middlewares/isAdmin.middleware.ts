import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import { RoleEnum } from "../generated/prisma/enums.js";

export const isAdminMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		return next(
			new ApiError(
				StatusCodes.UNAUTHORIZED,
				"Akses ditolak! token tidak ditemukan",
			),
		);
	}

	if (req.user.role !== RoleEnum.ADMIN) {
		return next(
			new ApiError(
				StatusCodes.UNAUTHORIZED,
				"Akses ditolak! Fitur khusus Admin",
			),
		);
	}

	next();
};

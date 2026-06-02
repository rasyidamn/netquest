import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response-formatter.util.js";
import { ApiError } from "../utils/api-error.util.js";

export const errorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!err) {
		next();
		return;
	}

	if (err instanceof ApiError) {
		sendError(res, err.status, err.message);
		return;
	}

	if (err instanceof ZodError) {
		sendError(res, 400, "validasi gagal", err.issues);
		return;
	}

	sendError(res, 500, "Terjadi kesalahan pada server", err.message);
};

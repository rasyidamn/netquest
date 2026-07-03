import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response-formatter.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { Prisma } from "../generated/prisma/client.js";

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

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			sendError(res, 409, "Konflik data: Nilai yang dimasukkan (seperti urutan) sudah digunakan dan harus unik.", err.meta);
			return;
		}
	}

	sendError(res, 500, "Terjadi kesalahan pada server", err.message);
};

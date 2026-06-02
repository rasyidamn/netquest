import type { Response } from "express";
import { success } from "zod";
import type { ApiResponse } from "../types/response.type.js";

export const sendSuccess = <T>(
	res: Response,
	statusCode: number,
	message: string,
	data: T,
): Response => {
	const responsePayload: ApiResponse<T> = {
		success: true,
		message,
		data,
	};

	return res.status(statusCode).json(responsePayload);
};

export const sendError = (
	res: Response,
	statusCode: number,
	message: string,
	errors?: any,
) => {
	const responsePayload: ApiResponse = {
		success: false,
		message,
		errors,
	};

	return res.status(statusCode).json(responsePayload);
};

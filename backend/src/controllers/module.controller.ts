import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { ModuleService } from "../services/module.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";

export class ModuleController {
	static getAllModules = catchAsync(async (req: Request, res: Response) => {
		const responseData = await ModuleService.getAllModules();
		sendSuccess(
			res,
			StatusCodes.OK,
			"Berhasil mengambil data modules",
			responseData,
		);
	});
	static createModule = catchAsync(async (req: Request, res: Response) => {});
	static updateModule = catchAsync(async (req: Request, res: Response) => {});
	static deleteModule = catchAsync(async (req: Request, res: Response) => {});
}

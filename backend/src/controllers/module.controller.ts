import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";

export class ModuleController {
	static getAllModules = catchAsync(
		async (req: Request, res: Response) => {},
	);
	static createModule = catchAsync(async (req: Request, res: Response) => {});
	static updateModule = catchAsync(async (req: Request, res: Response) => {});
	static deleteModule = catchAsync(async (req: Request, res: Response) => {});
}

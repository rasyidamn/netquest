import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import { ModuleSchema, type ModuleResponse } from "../schemas/module.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import z from "zod";

export class ModuleService {
	static getAllModules = async (): Promise<ModuleResponse[]> => {
		const modules = await prisma.module.findMany({
			orderBy: {
				sequence: "asc",
			},
		});
		if (modules.length === 0) {
			return [];
		}

		const responseData = z.array(ModuleSchema.MODULE_MODEL).parse(modules);
		return responseData;
	};
}

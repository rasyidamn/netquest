import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import {
	ModuleSchema,
	type CreateModuleRequest,
	type ModuleResponse,
	type UpdateModuleRequest,
} from "../schemas/module.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import z from "zod";
import type { Prisma } from "../generated/prisma/client.js";

export class ModuleService {
	static getAllModules = async (role?: string): Promise<ModuleResponse[]> => {
		const whereClause = role === "ADMIN" ? {} : { isPublished: true };
		
		const modules = await prisma.module.findMany({
			where: whereClause,
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

	static createModule = async (
		validatedData: CreateModuleRequest,
	): Promise<ModuleResponse> => {
		const newModule = await prisma.module.create({
			data: validatedData,
		});

		const responseData = ModuleSchema.MODULE_MODEL.parse(newModule);
		return responseData;
	};

	static updateModule = async (
		moduleId: string,
		validatedData: UpdateModuleRequest,
	): Promise<ModuleResponse> => {
		const existingModule = await prisma.module.findUnique({
			where: {
				id: moduleId,
			},
		});
		if (!existingModule) {
			throw new ApiError(
				StatusCodes.NOT_FOUND,
				"Module tidak ditemukan!",
			);
		}

		const updatedModule = await prisma.module.update({
			where: {
				id: moduleId,
			},
			data: validatedData as Prisma.ModuleUpdateInput,
		});

		const responseData = ModuleSchema.MODULE_MODEL.parse(updatedModule);
		return responseData;
	};

	static deleteModule = async (moduleId: string): Promise<void> => {
		const existingModule = await prisma.module.findUnique({
			where: {
				id: moduleId,
			},
		});
		if (!existingModule) {
			throw new ApiError(
				StatusCodes.NOT_FOUND,
				"Module tidak ditemukan!",
			);
		}

		await prisma.module.delete({
			where: {
				id: moduleId,
			},
		});
	};
}

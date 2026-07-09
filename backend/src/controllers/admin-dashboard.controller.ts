import type { Request, Response } from "express";
import { AdminDashboardService } from "../services/admin-dashboard.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";

export class AdminDashboardController {
	static getDashboardStats = async (req: Request, res: Response) => {
		const stats = await AdminDashboardService.getDashboardStats();

		return sendSuccess(res, 200, "Dashboard stats fetched successfully", stats);
	};
}

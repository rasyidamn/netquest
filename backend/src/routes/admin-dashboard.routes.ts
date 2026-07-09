import { Router } from "express";
import { AdminDashboardController } from "../controllers/admin-dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";
import { catchAsync } from "../utils/catch-async.util.js";

const adminDashboardRouter = Router();

// Endpoint ini akan dilindungi dan hanya bisa diakses oleh admin
adminDashboardRouter.get(
	"/",
	authMiddleware,
	isAdminMiddleware,
	catchAsync(AdminDashboardController.getDashboardStats)
);

export default adminDashboardRouter;

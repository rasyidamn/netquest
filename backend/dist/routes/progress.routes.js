import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ProgressController } from "../controllers/progress.controller.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";
export const progressRouter = Router();
// Endpoint Mahasiswa (Harus login)
progressRouter.get("/", authMiddleware, ProgressController.getMyProgress);
// Endpoint Admin (Harus login & Role Admin)
progressRouter.get("/all", authMiddleware, isAdminMiddleware, ProgressController.getAllProgress);
//# sourceMappingURL=progress.routes.js.map
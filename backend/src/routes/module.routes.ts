import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ModuleController } from "../controllers/module.controller.js";

export const moduleRouter = Router();

// AUTH
moduleRouter.use(authMiddleware);

moduleRouter.get("/", ModuleController.getAllModules);

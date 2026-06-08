import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ModuleController } from "../controllers/module.controller.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";
import { LessonController } from "../controllers/lesson.controller.js";

export const moduleRouter = Router();

// AUTH
moduleRouter.use(authMiddleware);

moduleRouter.get("/", ModuleController.getAllModules);
moduleRouter.get("/:id/lessons", LessonController.getLessonByModule);

// ADMIN
moduleRouter.use(isAdminMiddleware);

moduleRouter.post("/:id/lessons", LessonController.createLesson);

moduleRouter.post("/", ModuleController.createModule);
moduleRouter.patch("/:id", ModuleController.updateModule);
moduleRouter.delete("/:id", ModuleController.deleteModule);


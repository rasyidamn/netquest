import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";
import { UserController } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.use(authMiddleware, isAdminMiddleware);

userRouter.get("/", UserController.getAllUsers);
userRouter.put("/:id", UserController.updateUser);
userRouter.delete("/:id", UserController.deleteUser);

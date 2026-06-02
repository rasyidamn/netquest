import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

// PUBLIC
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

// AUTH
authRouter.use(authMiddleware);

authRouter.get("/profile", AuthController.getProfile);

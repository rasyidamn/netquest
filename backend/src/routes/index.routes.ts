import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { moduleRouter } from "./module.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/modules", moduleRouter)

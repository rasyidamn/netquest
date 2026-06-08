import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { moduleRouter } from "./module.routes.js";
import { lessonRouter } from "./lesson.routes.js";
import { gameplayRouter } from "./gameplay.routes.js";
import { progressRouter } from "./progress.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/modules", moduleRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/gameplay", gameplayRouter);
apiRouter.use("/progress", progressRouter);

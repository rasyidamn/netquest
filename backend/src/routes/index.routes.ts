import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { moduleRouter } from "./module.routes.js";
import { lessonRouter } from "./lesson.routes.js";
import { gameplayRouter } from "./gameplay.routes.js";
import { progressRouter } from "./progress.routes.js";
import { leaderboardRouter } from "./leaderboard.routes.js";
import { uploadRouter } from "./upload.routes.js";
import { userRouter } from "./user.routes.js";
import adminDashboardRouter from "./admin-dashboard.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/modules", moduleRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/gameplay", gameplayRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/leaderboard", leaderboardRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/admin-dashboard", adminDashboardRouter);

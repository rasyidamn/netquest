import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { LeaderboardController } from "../controllers/leaderboard.controller.js";
export const leaderboardRouter = Router();
leaderboardRouter.get("/", authMiddleware, LeaderboardController.getLeaderboard);
//# sourceMappingURL=leaderboard.routes.js.map
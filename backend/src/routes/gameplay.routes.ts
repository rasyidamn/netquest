import { Router } from "express";
import { GameplayController } from "../controllers/gameplay.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const gameplayRouter = Router();

// AUTH
gameplayRouter.use(authMiddleware);

gameplayRouter.post("/theory-done", GameplayController.theoryDone);
gameplayRouter.post("/submit-quiz", GameplayController.submitQuiz);
gameplayRouter.post("/complete-quiz", GameplayController.completeQuiz)
gameplayRouter.post("/recover-heart", GameplayController.recoverHeart);

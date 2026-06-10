import type { Request, Response } from "express";
export declare class GameplayController {
    static theoryDone: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static submitQuiz: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static completeQuiz: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static recoverHeart: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
}
//# sourceMappingURL=gameplay.controller.d.ts.map
import type { Request, Response } from "express";
export declare class LessonController {
    static getLessonByModule: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static getLessonDetail: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static createLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static updateLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static deleteLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static upsertMaterial: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static createQuestionWithOption: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static updateQuestionWithOption: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static deleteQuestion: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
}
//# sourceMappingURL=lesson.controller.d.ts.map
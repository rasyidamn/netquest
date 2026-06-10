import type { Request, Response } from "express";
export declare class AuthController {
    static register: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static login: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    static getProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map
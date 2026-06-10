import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../utils/generateJWT.util.js";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map
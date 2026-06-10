import type { NextFunction, Request, Response } from "express";
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=catch-async.util.d.ts.map
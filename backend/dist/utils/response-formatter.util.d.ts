import type { Response } from "express";
export declare const sendSuccess: <T>(res: Response, statusCode: number, message: string, data: T) => Response;
export declare const sendError: (res: Response, statusCode: number, message: string, errors?: any) => Response<any, Record<string, any>>;
//# sourceMappingURL=response-formatter.util.d.ts.map
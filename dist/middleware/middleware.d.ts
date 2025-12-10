import { NextFunction, Request, Response } from "express";
export interface JWTPayload {
    userId: string;
    email: string;
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=middleware.d.ts.map
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export interface JWTPayload {
    userId: string,
    email: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ messgae: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)

        req.user = decoded; // attach user info (id + email)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
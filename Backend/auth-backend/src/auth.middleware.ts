import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
        (req as any).userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

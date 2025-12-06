import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthPayload extends JwtPayload {
    userId: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    // ✅ Check for header
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.substring(7); // now safe

    try {
        // ✅ Verify token
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AuthPayload;

        // ✅ Store userId in res.locals
        res.locals.userId = payload.userId;

        // Continue to next middleware/route
        return next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

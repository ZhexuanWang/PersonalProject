import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
    userId: string;
    email?: string;
    role?: string;
}

export type AuthenticatedRequest = Request & {
    user?: AuthPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (authHeader != null) {
        const token = authHeader.split(" ")[1];

        try {
            req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AuthPayload;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
}

// src/auth.util.ts
import jwt from "jsonwebtoken";

export type JwtPayload = { sub: string; email: string };

export const signAccessToken = (userId: string, email: string) =>
    jwt.sign({ sub: userId, email }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

export const signRefreshToken = (userId: string, email: string) =>
    jwt.sign({ sub: userId, email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
    jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

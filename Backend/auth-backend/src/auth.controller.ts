import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { findUserByEmail, createUser } from "./db";

const ACCESS_EXP = "15m";
const REFRESH_EXP = "7d";

export async function register(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const user = await createUser({ email, password_hash: hash });

    res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const access = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: ACCESS_EXP });
    const refresh = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_EXP });
    res.cookie("refresh_token", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ access_token: access });
}

export async function refresh(req: Request, res: Response) {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
        const access = jwt.sign({ userId: payload.userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: ACCESS_EXP });
        res.json({ access_token: access });
    } catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
}

export async function logout(_req: Request, res: Response) {
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    res.json({ message: "Logged out" });
}

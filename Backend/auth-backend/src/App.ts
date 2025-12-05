import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { register, login, refresh, logout } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://personal-project-nine-beta.vercel.app"],
    credentials: true,
}));

app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/auth/refresh", refresh);
app.post("/auth/logout", logout);

app.get("/profile", requireAuth, (req, res) => {
    res.json({ message: "Protected route", userId: (req as any).userId });
});

export default app;

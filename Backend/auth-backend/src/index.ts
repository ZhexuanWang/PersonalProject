import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { register, login, refresh, logout } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

dotenv.config();

const app = express();

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://personal-project-nine-beta.vercel.app"],
    credentials: true,
}));

// Public route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Auth routes
app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/auth/refresh", refresh);
app.post("/auth/logout", logout);

// Protected route
app.get("/profile", requireAuth, (req, res) => {
    res.json({ message: "Protected route", userId: res.locals.userId });
});

// ✅ Export for Vercel
module.exports = serverless(app);

// ✅ Local dev: run normally if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}

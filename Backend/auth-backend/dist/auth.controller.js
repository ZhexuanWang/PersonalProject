"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = require("./db");
const ACCESS_EXP = "15m";
const REFRESH_EXP = "7d";
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Missing fields" });
    const existing = await (0, db_1.findUserByEmail)(email);
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 12);
    const user = await (0, db_1.createUser)({ email, password_hash: hash });
    res.status(201).json({ id: user.id, email: user.email });
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await (0, db_1.findUserByEmail)(email);
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    const access = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXP });
    const refresh = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXP });
    res.cookie("refresh_token", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ access_token: access });
}
async function refresh(req, res) {
    const token = req.cookies?.refresh_token;
    if (!token)
        return res.status(401).json({ message: "Missing refresh token" });
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const access = jwt.sign({ userId: payload.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXP });
        res.json({ access_token: access });
    }
    catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
}
async function logout(_req, res) {
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    res.json({ message: "Logged out" });
}
//# sourceMappingURL=auth.controller.js.map
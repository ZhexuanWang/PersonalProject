"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/index.ts
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const uuid_1 = require("uuid");
const store_1 = require("../store");
const auth_util_1 = require("../auth.util");
const app = (0, express_1.default)();
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID must be set in environment");
}
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// ✅ Fixed CORS with Vercel preview support
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://personal-project-frontend.vercel.app'
        ];
        const vercelRegex = /^https:\/\/personal-project-frontend-[^.]+-zhexuanwangs-projects\.vercel\.app$/;
        if (!origin || allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use((0, cors_1.default)(corsOptions));
app.options(/.*/, (0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:5000"],
        },
    },
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (_req, res) => {
    res.send("Auth backend is running 🚀");
});
// ✅ Helper: set refresh cookie
function setRefreshCookie(res, token) {
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV?.toLowerCase() === "production",
        path: "/auth/refresh"
    });
}
// ✅ Middleware: require access token
function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const token = auth.slice(7);
        req.user = (0, auth_util_1.verifyAccessToken)(token);
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
// ✅ Health and test endpoints
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-backend' });
});
app.get('/test-me', (req, res) => {
    res.json({ test: 'GET is working', endpoint: '/test-me' });
});
app.get('/me-test', (req, res) => {
    res.json({ test: 'GET is working', endpoint: '/me-test' });
});
// ✅ POST /auth/register - FIXED with await
app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });
    const existing = await (0, store_1.findUserByEmail)(email);
    if (existing)
        return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = (0, store_1.createUser)({ id: (0, uuid_1.v4)(), email, name, passwordHash, googleLinked: false });
    const access = (0, auth_util_1.signAccessToken)(user.id, user.email);
    const refresh = (0, auth_util_1.signRefreshToken)(user.id, user.email);
    setRefreshCookie(res, refresh);
    res.json({ accessToken: access, user: { id: user.id, email: user.email, name: user.name } });
});
// ✅ POST /auth/login - FIXED with await
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await (0, store_1.findUserByEmail)(email);
    if (!user || !user.passwordHash)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const access = (0, auth_util_1.signAccessToken)(user.id, user.email);
    const refresh = (0, auth_util_1.signRefreshToken)(user.id, user.email);
    setRefreshCookie(res, refresh);
    res.json({ accessToken: access, user: { id: user.id, email: user.email, name: user.name } });
});
// ✅ POST /auth/google - FIXED with await
app.post("/auth/google", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken)
        return res.status(400).json({ error: "idToken required" });
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ error: "Google email missing" });
        let user = await (0, store_1.findUserByEmail)(payload.email);
        if (!user) {
            user = (0, store_1.createUser)({
                id: (0, uuid_1.v4)(),
                email: payload.email,
                googleLinked: true,
                ...(payload.name ? { name: payload.name } : {})
            });
        }
        else {
            if (!user.googleLinked)
                user = await (0, store_1.updateUser)(user.id, { googleLinked: true });
        }
        const access = (0, auth_util_1.signAccessToken)(user.id, user.email);
        const refresh = (0, auth_util_1.signRefreshToken)(user.id, user.email);
        setRefreshCookie(res, refresh);
        res.json({
            accessToken: access,
            user: { id: user.id, email: user.email, name: user.name },
            needsPassword: !user.passwordHash
        });
    }
    catch {
        res.status(401).json({ error: "Invalid Google token" });
    }
});
// ✅ POST /auth/set-password - FIXED with await
app.post("/auth/set-password", requireAuth, async (req, res) => {
    const { password } = req.body;
    if (!password)
        return res.status(400).json({ error: "Password required" });
    const { sub } = req.user;
    const user = await (0, store_1.findUserById)(sub);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const hash = await bcrypt_1.default.hash(password, 10);
    const updated = await (0, store_1.updateUser)(user.id, { passwordHash: hash });
    const accessToken = (0, auth_util_1.signAccessToken)(updated.id, updated.email);
    res.json({
        accessToken,
        user: {
            id: updated.id,
            email: updated.email,
            name: updated.name
        }
    });
});
// ✅ GET /me - PROPERLY IMPLEMENTED with auth and await
app.get("/me", requireAuth, async (req, res) => {
    const { sub } = req.user;
    const user = await (0, store_1.findUserById)(sub);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        googleLinked: user.googleLinked,
        hasPassword: !!user.passwordHash
    });
});
// ✅ POST /auth/refresh
app.post("/auth/refresh", (req, res) => {
    const rt = req.cookies["refresh_token"];
    if (!rt)
        return res.status(401).json({ error: "No refresh token" });
    try {
        const payload = (0, auth_util_1.verifyRefreshToken)(rt);
        const access = (0, auth_util_1.signAccessToken)(payload.sub, payload.email);
        res.json({ accessToken: access });
    }
    catch {
        res.status(401).json({ error: "Invalid refresh token" });
    }
});
// ✅ POST /auth/logout
app.post("/auth/logout", (_req, res) => {
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    res.json({ ok: true });
});
// ✅ 404 handler - MUST BE LAST
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
const port = Number(process.env.PORT) || 5000;
const host = '0.0.0.0';
app.listen(port, host, () => {
    console.log(`✅ Auth server running on http://${host}:${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Render External URL: ${process.env.RENDER_EXTERNAL_URL || 'Not on Render'}`);
});
//# sourceMappingURL=index.js.map
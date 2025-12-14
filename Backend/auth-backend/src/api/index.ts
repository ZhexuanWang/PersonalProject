// src/api/index.ts
import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import {OAuth2Client} from "google-auth-library";
import {v4 as uuid} from "uuid";
import {createUser, findUserByEmail, findUserById, updateUser} from "../store";
import {signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken} from "../auth.util";

const app = express();
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID must be set in environment");
}
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", "http://localhost:5000"],
            },
        },
    })
);
app.use(express.json());
app.use(cookieParser());

//通配符 * 在 origin 数组中是无效的 - Vercel 预览域名需要用正则表达式
// 缺少对 OPTIONS 请求的处理 - 预检请求需要特殊处理
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {        // 允许的域名列表
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://personal-project-frontend.vercel.app'
        ];

        // 正则表达式匹配所有 Vercel 预览域名
        const vercelRegex = /https:\/\/personal-project-frontend-.+-zhexuanwangs-projects\.vercel\.app/;

        if (!origin || allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// 特别处理 OPTIONS 请求（重要！）
app.options(/.*/, cors(corsOptions));


app.get("/", (_req: Request, res: Response) => {
    res.send("Auth backend is running 🚀");
});

// Helper: set refresh cookie
function setRefreshCookie(res: Response, token: string) {
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV?.toLowerCase() === "production",
        path: "/auth/refresh"
    });
}

// Middleware: require access token
function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({error: "Unauthorized"});
    }
    try {
        const token = auth.slice(7);
        // contains sub + email
        (req as any).user = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({error: "Invalid token"});
    }
}

// POST /auth/register
app.post("/auth/register", async (req: Request, res: Response) => {
    const {email, password, name} = req.body;
    if (!email || !password) return res.status(400).json({error: "Email and password required"});

    const existing = findUserByEmail(email);
    if (existing) return res.status(409).json({error: "Email already registered"});

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({id: uuid(), email, name, passwordHash, googleLinked: false});

    const access = signAccessToken(user.id, user.email);
    const refresh = signRefreshToken(user.id, user.email);
    setRefreshCookie(res, refresh);

    res.json({accessToken: access, user: {id: user.id, email: user.email, name: user.name}});
});

// POST /auth/login
app.post("/auth/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = findUserByEmail(email);
    if (!user || !user.passwordHash) return res.status(401).json({error: "Invalid credentials"});

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({error: "Invalid credentials"});

    const access = signAccessToken(user.id, user.email);
    const refresh = signRefreshToken(user.id, user.email);
    setRefreshCookie(res, refresh);

    res.json({accessToken: access, user: {id: user.id, email: user.email, name: user.name}});
});

// POST /auth/google
app.post("/auth/google", async (req: Request, res: Response) => {
    const {idToken} = req.body;
    if (!idToken) return res.status(400).json({error: "idToken required"});

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID as string
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) return res.status(400).json({error: "Google email missing"});

        let user = findUserByEmail(payload.email);
        if (!user) {
            // ✅ only include name if defined
            user = createUser({
                id: uuid(),
                email: payload.email,
                googleLinked: true,
                ...(payload.name ? {name: payload.name} : {})
            });
        } else {
            if (!user.googleLinked) user = updateUser(user.id, {googleLinked: true})!;
        }

        const access = signAccessToken(user.id, user.email);
        const refresh = signRefreshToken(user.id, user.email);
        setRefreshCookie(res, refresh);

        res.json({
            accessToken: access,
            user: {id: user.id, email: user.email, name: user.name},
            needsPassword: !user.passwordHash
        });
    } catch {
        res.status(401).json({error: "Invalid Google token"});
    }
});

// POST /auth/set-password
app.post("/auth/set-password", requireAuth, async (req: Request, res: Response) => {
    const {password} = req.body;
    if (!password) return res.status(400).json({error: "Password required"});

    const {sub} = (req as any).user;
    const user = findUserById(sub);
    if (!user) return res.status(404).json({error: "User not found"});

    const hash = await bcrypt.hash(password, 10);
    const updated = updateUser(user.id, {passwordHash: hash})!;
    const accessToken = signAccessToken(updated.id, updated.email);

    res.json({
        accessToken,
        user: {
            id: updated.id,
            email: updated.email,
            name: updated.name
        }
    });
});

// POST /auth/refresh
app.post("/auth/refresh", (req: Request, res: Response) => {
    const rt = req.cookies["refresh_token"];
    if (!rt) return res.status(401).json({error: "No refresh token"});
    try {
        const payload = verifyRefreshToken(rt);
        const access = signAccessToken(payload.sub, payload.email);
        res.json({accessToken: access});
    } catch {
        res.status(401).json({error: "Invalid refresh token"});
    }
});

// POST /auth/logout
app.post("/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie("refresh_token", {path: "/auth/refresh"});
    res.json({ok: true});
});

// GET /me
app.get("/me", requireAuth, (req: Request, res: Response) => {
    const {sub} = (req as any).user;
    const user = findUserById(sub);
    if (!user) return res.status(404).json({error: "User not found"});
    res.json({
        id: user!.id,
        email: user!.email,
        name: user!.name,
        googleLinked: user!.googleLinked,
        hasPassword: !!user!.passwordHash
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Auth server running on port ${port}`));

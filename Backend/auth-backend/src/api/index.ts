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

// ✅ Fixed CORS with Vercel preview support
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://personal-project-frontend.vercel.app'
        ];

        const vercelRegex = /^https:\/\/personal-project-.+\.vercel\.app$/;

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
app.options(/.*/, cors(corsOptions));

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

app.get("/", (_req: Request, res: Response) => {
    res.send("Auth backend is running 🚀");
});

// ✅ Helper: set refresh cookie
function setRefreshCookie(res: Response, token: string) {
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV?.toLowerCase() === "production",
        path: "/auth/refresh"
    });
}

// ✅ Middleware: require access token
function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({error: "Unauthorized"});
    }
    try {
        const token = auth.slice(7);
        (req as any).user = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({error: "Invalid token"});
    }
}

// ✅ Health and test endpoints
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', service: 'auth-backend' });
});

app.get('/test-me', (req: Request, res: Response) => {
    res.json({ test: 'GET is working', endpoint: '/test-me' });
});

app.get('/me-test', (req: Request, res: Response) => {
    res.json({ test: 'GET is working', endpoint: '/me-test' });
});

// ✅ POST /auth/register - FIXED with await
app.post("/auth/register", async (req: Request, res: Response) => {
    const {email, password, name} = req.body;
    if (!email || !password) return res.status(400).json({error: "Email and password required"});

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({error: "Email already registered"});

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({id: uuid(), email, name, passwordHash, googleLinked: false});

    const access = signAccessToken(user.id, user.email);
    const refresh = signRefreshToken(user.id, user.email);
    setRefreshCookie(res, refresh);

    res.json({accessToken: access, user: {id: user.id, email: user.email, name: user.name}});
});

// ✅ POST /auth/login - FIXED with await
app.post("/auth/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) return res.status(401).json({error: "Invalid credentials"});

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({error: "Invalid credentials"});

    const access = signAccessToken(user.id, user.email);
    const refresh = signRefreshToken(user.id, user.email);
    setRefreshCookie(res, refresh);

    res.json({accessToken: access, user: {id: user.id, email: user.email, name: user.name}});
});

// ✅ POST /auth/google - FIXED with await
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

        let user = await findUserByEmail(payload.email);
        if (!user) {
            user = createUser({
                id: uuid(),
                email: payload.email,
                googleLinked: true,
                ...(payload.name ? {name: payload.name} : {})
            });
        } else {
            if (!user.googleLinked) user = await updateUser(user.id, {googleLinked: true})!;
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

// ✅ POST /auth/set-password - FIXED with await
app.post("/auth/set-password", requireAuth, async (req: Request, res: Response) => {
    const {password} = req.body;
    if (!password) return res.status(400).json({error: "Password required"});

    const {sub} = (req as any).user;
    const user = await findUserById(sub);
    if (!user) return res.status(404).json({error: "User not found"});

    const hash = await bcrypt.hash(password, 10);
    const updated = await updateUser(user.id, {passwordHash: hash})!;
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

// ✅ GET /me - PROPERLY IMPLEMENTED with auth and await
app.get("/me", requireAuth, async (req: Request, res: Response) => {
    const {sub} = (req as any).user;
    const user = await findUserById(sub);
    if (!user) return res.status(404).json({error: "User not found"});

    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        googleLinked: user.googleLinked,
        hasPassword: !!user.passwordHash
    });
});

// ✅ POST /auth/refresh
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

// ✅ POST /auth/logout
app.post("/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie("refresh_token", {path: "/auth/refresh"});
    res.json({ok: true});
});

// ✅ 404 handler - MUST BE LAST
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

const port = Number(process.env.PORT) || 5000;
const host = '0.0.0.0';

app.listen(port, host, () => {
    console.log(`✅ Auth server running on http://${host}:${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Render External URL: ${process.env.RENDER_EXTERNAL_URL || 'Not on Render'}`);
});

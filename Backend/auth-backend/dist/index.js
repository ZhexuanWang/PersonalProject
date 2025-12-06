"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security & middleware
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://personal-project-nine-beta.vercel.app"],
    credentials: true,
}));
// Public route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});
// Auth routes
app.post("/auth/register", auth_controller_1.register);
app.post("/auth/login", auth_controller_1.login);
app.post("/auth/refresh", auth_controller_1.refresh);
app.post("/auth/logout", auth_controller_1.logout);
// Protected route
app.get("/profile", auth_middleware_1.requireAuth, (req, res) => {
    res.json({ message: "Protected route", userId: res.locals.userId });
});
// ✅ Export for Vercel
module.exports = (0, serverless_http_1.default)(app);
// ✅ Local dev: run normally if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map
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
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://personal-project-nine-beta.vercel.app"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Backend is running!");
});
app.post("/auth/register", auth_controller_1.register);
app.post("/auth/login", auth_controller_1.login);
app.post("/auth/refresh", auth_controller_1.refresh);
app.post("/auth/logout", auth_controller_1.logout);
app.get("/profile", auth_middleware_1.requireAuth, (req, res) => {
    res.json({ message: "Protected route", userId: res.locals.userId });
});
exports.default = app;
//# sourceMappingURL=backendApp.js.map
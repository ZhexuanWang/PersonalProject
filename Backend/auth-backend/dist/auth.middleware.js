"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    // ✅ Check for header
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }
    const token = header.substring(7); // now safe
    try {
        // ✅ Verify token
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        // ✅ Store userId in res.locals
        res.locals.userId = payload.userId;
        // Continue to next middleware/route
        return next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
//# sourceMappingURL=auth.middleware.js.map
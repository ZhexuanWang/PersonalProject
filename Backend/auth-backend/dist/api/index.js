"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const backendApp_1 = __importDefault(require("../backendApp"));
const app = (0, express_1.default)();
// Middleware & routes
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello from Express on Vercel!");
});
// Export for Vercel
module.exports = (0, serverless_http_1.default)(app);
// Local dev: run app.listen if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    backendApp_1.default.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map
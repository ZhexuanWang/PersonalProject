"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const backendApp_1 = __importDefault(require("./backendApp"));
const serverless_http_1 = __importDefault(require("serverless-http"));
// Always export for Vercel
module.exports = (0, serverless_http_1.default)(backendApp_1.default);
// Local dev: run app.listen if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    backendApp_1.default.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map
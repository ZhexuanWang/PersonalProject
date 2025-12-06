"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts (single entry point)
const backendApp_1 = __importDefault(require("./backendApp"));
const serverless_http_1 = __importDefault(require("serverless-http"));
// If running on Vercel (serverless), export the handler
if (process.env.VERCEL) {
    module.exports = (0, serverless_http_1.default)(backendApp_1.default);
}
else {
    // Otherwise, run locally with app.listen
    const PORT = process.env.PORT || 5000;
    backendApp_1.default.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backendApp_1 = __importDefault(require("./backendApp"));
const PORT = process.env.PORT || 5000;
backendApp_1.default.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backendApp_1 = __importDefault(require("../backendApp"));
const serverless_http_1 = __importDefault(require("serverless-http"));
module.exports.handler = (0, serverless_http_1.default)(backendApp_1.default);
//# sourceMappingURL=index.js.map
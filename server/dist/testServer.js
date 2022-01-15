"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestServer = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
function createTestServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(router_1.default);
    return app;
}
exports.createTestServer = createTestServer;
//# sourceMappingURL=testServer.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function decodeToken(token) {
    const profile = jsonwebtoken_1.default.decode(token);
    return profile;
}
exports.decodeToken = decodeToken;
//# sourceMappingURL=decodeToken.js.map
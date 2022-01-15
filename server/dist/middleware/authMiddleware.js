"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const utils_1 = require("../utils");
require("dotenv").config();
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = null;
        if (req.headers && req.headers.authorization) {
            if (typeof req.headers.authorization === "string") {
                token = req.headers.authorization.split(" ")[1].trim();
            }
        }
        if (!token) {
            return res.status(401).json({ error: "not authenticated" });
        }
        const decoded = yield (0, utils_1.verifyTokenAsync)(token);
        if (decoded instanceof Error) {
            return res.status(403).json({ error: decoded });
        }
        else {
            req.user = decoded;
            next();
        }
    });
}
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map
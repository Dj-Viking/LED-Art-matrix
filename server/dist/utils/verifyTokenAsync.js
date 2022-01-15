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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAsync = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const readEnv_1 = require("../utils/readEnv");
(0, readEnv_1.readEnv)();
const { EXPIRATION, SECRET } = process.env;
function verifyTokenAsync(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            let returnMe;
            jsonwebtoken_1.default.verify(token, SECRET, { maxAge: EXPIRATION }, (error, decoded) => {
                if (!!error)
                    returnMe = error;
                if (decoded)
                    returnMe = decoded;
            });
            resolve(returnMe);
        });
    });
}
exports.verifyTokenAsync = verifyTokenAsync;
//# sourceMappingURL=verifyTokenAsync.js.map
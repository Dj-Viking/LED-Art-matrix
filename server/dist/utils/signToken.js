"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const readEnv_1 = require("./readEnv");
(0, readEnv_1.readEnv)();
const { SECRET, EXPIRATION } = process.env;
function signToken(args) {
    const { username, _id, role, uuid: someUuid, email, } = args;
    const { resetEmail, uuid, exp } = args;
    const { adminUuid } = args;
    switch (true) {
        case Boolean(username && someUuid && email && _id && role): {
            return jsonwebtoken_1.default.sign({
                username,
                _id,
                role,
                uuid: someUuid,
                email,
            }, SECRET, { expiresIn: EXPIRATION });
        }
        case Boolean(uuid && exp && resetEmail): {
            return jsonwebtoken_1.default.sign({
                resetEmail,
                uuid,
            }, SECRET, { expiresIn: exp });
        }
        case Boolean(adminUuid): {
            return jsonwebtoken_1.default.sign({
                adminUuid,
                role: "admin",
            }, SECRET, { expiresIn: "240000h" });
        }
        case Boolean(username && email && _id && someUuid && typeof role === "undefined"): {
            return jsonwebtoken_1.default.sign({
                someUuid,
                username,
                email,
                _id,
                role: void 0,
            }, SECRET, { expiresIn: EXPIRATION });
        }
        default:
            return `couldn't create a token from the input args in signToken, one of the properties in the args input object was possibly null or undefined`;
    }
}
exports.signToken = signToken;
//# sourceMappingURL=signToken.js.map
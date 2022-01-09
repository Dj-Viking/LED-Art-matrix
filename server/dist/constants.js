"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_DOMAIN_PREFIX = exports.IS_PROD = void 0;
require("dotenv").config();
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.APP_DOMAIN_PREFIX = exports.IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3000";
//# sourceMappingURL=constants.js.map
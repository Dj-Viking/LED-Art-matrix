"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_PASSWORD = exports.TEST_EMAIL = exports.TEST_USERNAME = exports.APP_DOMAIN_PREFIX = exports.IS_PROD = exports.TEST_DB_URL = void 0;
require("dotenv").config();
exports.TEST_DB_URL = "mongodb://localhost/led-matrix-test";
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://led-matrices.herokuapp.com"
    : "http://localhost:3000";
exports.TEST_USERNAME = "test-user";
exports.TEST_EMAIL = "test@email.com";
exports.TEST_PASSWORD = "test password";
//# sourceMappingURL=constants.js.map
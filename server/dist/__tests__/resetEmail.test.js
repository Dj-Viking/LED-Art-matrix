"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const readEnv_1 = require("../utils/readEnv");
const constants_1 = require("../constants");
const testServer_1 = require("../testServer");
const models_1 = require("../models");
(0, readEnv_1.readEnv)();
const foo_bar_baz_1 = __importStar(require("../stubs/foo-bar-baz"));
const sendEmail_1 = require("../utils/sendEmail");
jest.mock("../utils/sendEmail.ts");
jest.mock("../stubs/foo-bar-baz", () => {
    const originalModule = jest.requireActual("../stubs/foo-bar-baz");
    return Object.assign(Object.assign({ __esModule: true }, originalModule), { default: jest.fn(() => "mocked baz"), foo: "mocked foo" });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(constants_1.TEST_DB_URL, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
}));
const app = (0, testServer_1.createTestServer)();
let newUserId = "";
describe("test the reset email function gets actually called but doesn't send an email", () => {
    test("/POST a user gets created", () => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield (0, supertest_1.default)(app)
            .post("/user")
            .send({
            username: constants_1.TEST_USERNAME,
            email: constants_1.TEST_EMAIL,
            password: constants_1.TEST_PASSWORD,
        });
        const parsed = JSON.parse(createUser.text);
        expect(createUser.status).toBe(201);
        expect(typeof parsed._id).toBe("string");
        newUserId = parsed._id;
    }));
    test("/POST try to send good email but doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const badEmail = yield (0, supertest_1.default)(app).post("/user/forgot").send({
            email: "dkfjkdjkf@dkjfdkj.com",
        });
        expect(badEmail.status).toBe(200);
        expect(sendEmail_1.sendEmail).toHaveBeenCalledTimes(0);
        const parsed = JSON.parse(badEmail.text);
        expect(parsed.message).toBe("success");
    }));
    test("/POST try to send bad email", () => __awaiter(void 0, void 0, void 0, function* () {
        const badEmail = yield (0, supertest_1.default)(app).post("/user/forgot").send({
            email: "dkfjkdjkf",
        });
        expect(badEmail.status).toBe(200);
        expect(sendEmail_1.sendEmail).toHaveBeenCalledTimes(0);
        const parsed = JSON.parse(badEmail.text);
        expect(parsed.message).toBe("success");
    }));
    test("/POST test dispatch user reset email func gets called", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app).post("/user/forgot").send({
            email: constants_1.TEST_EMAIL,
        });
        expect(forgotPassword.status).toBe(200);
        expect(sendEmail_1.sendEmail).toHaveBeenCalledTimes(1);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed.message).toBe("success");
    }));
    test("should do a partial mock", () => {
        const defaultExportResult = (0, foo_bar_baz_1.default)();
        expect(defaultExportResult).toBe("mocked baz");
        expect(foo_bar_baz_1.default).toHaveBeenCalled();
        expect(foo_bar_baz_1.foo).toBe("mocked foo");
        expect((0, foo_bar_baz_1.bar)()).toBe("bar");
    });
    test("deletes the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=resetEmail.test.js.map
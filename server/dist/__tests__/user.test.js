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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const readEnv_1 = require("../utils/readEnv");
const constants_1 = require("../constants");
const testServer_1 = require("../testServer");
const models_1 = require("../models");
(0, readEnv_1.readEnv)();
beforeEach((done) => {
    mongoose_1.default.connect(constants_1.TEST_DB_URL, {}, () => done());
});
afterEach((done) => {
    mongoose_1.default.connection.close(() => done());
});
const app = (0, testServer_1.createTestServer)();
let newUserId = "";
let newUserToken = "";
describe("test this runs through CRUD of a user entity", () => {
    test("/POST a user gets created", () => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield (0, supertest_1.default)(app).post("/user").send({
            username: constants_1.TEST_USERNAME,
            email: constants_1.TEST_EMAIL,
            password: constants_1.TEST_PASSWORD,
        });
        const parsed = JSON.parse(createUser.text);
        expect(createUser.status).toBe(201);
        expect(typeof parsed._id).toBe("string");
        newUserId = parsed._id;
        expect(typeof parsed.token).toBe("string");
        newUserToken = parsed.token;
    }));
    test("/POST this new user can now login", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            usernameOrEmail: {
                username: constants_1.TEST_USERNAME,
                email: void 0,
            },
            password: constants_1.TEST_PASSWORD,
        });
        const parsed = JSON.parse(login.text);
        expect(login.status).toBe(200);
        expect(typeof parsed.user.token).toBe("string");
        expect(parsed.user.token !== newUserToken).toBe(true);
    }));
    test("deletes the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=user.test.js.map
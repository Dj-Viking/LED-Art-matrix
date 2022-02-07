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
const utils_1 = require("../utils");
const uuid = require("uuid");
(0, readEnv_1.readEnv)();
const { INVALID_SIGNATURE } = process.env;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(constants_1.TEST_DB_URL, {});
}));
afterAll(() => {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
});
const app = (0, testServer_1.createTestServer)();
let newUserId = "";
let newUserToken = "";
describe("test this runs through CRUD of a user entity", () => {
    test("POST /user try to sign up with out data", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, supertest_1.default)(app).post("/user");
        expect(user.status).toBe(400);
        expect(JSON.parse(user.text).error).toBe("missing username, email, or password in the signup request.");
    }));
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
        expect(typeof parsed.token).toBe("string");
        newUserToken = parsed.token;
    }));
    test("GET /user get the user info and their default preset", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, supertest_1.default)(app)
            .get("/user")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(user.status).toBe(200);
        const parsed = JSON.parse(user.text);
        expect(parsed.preset).toBe("waves");
    }));
    test("POST /user/login with just email", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            usernameOrEmail: {
                username: void 0,
                email: constants_1.TEST_EMAIL,
            },
            password: constants_1.TEST_PASSWORD,
        });
        expect(login.status).toBe(200);
    }));
    test("POST /user/login try to login with bad password", () => __awaiter(void 0, void 0, void 0, function* () {
        const badPass = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            usernameOrEmail: {
                username: constants_1.TEST_USERNAME,
                email: void 0,
            },
            password: "dkjfkdjfk",
        });
        expect(badPass.status).toBe(400);
        expect(JSON.parse(badPass.text).error).toBe("Incorrect Credentials");
    }));
    test("POST /user/login try to login with wrong credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const badCreds = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            usernameOrEmail: {
                username: void 0,
                email: void 0,
            },
            password: constants_1.TEST_PASSWORD,
        });
        expect(badCreds.status).toBe(400);
        expect(JSON.parse(badCreds.text).error).toBe("Incorrect Credentials");
    }));
    test("POST /user/login this new user can now login", () => __awaiter(void 0, void 0, void 0, function* () {
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
    test("PUT /change-pass user attempt to change password with bad token", () => __awaiter(void 0, void 0, void 0, function* () {
        let resetToken = (0, utils_1.signToken)({
            resetEmail: constants_1.TEST_EMAIL,
            uuid: uuid.v4(),
            exp: "5m",
        });
        resetToken += resetToken.replace(resetToken[0], "kdjkfdjfdk");
        const change = yield (0, supertest_1.default)(app).put("/user/change-pass").send({
            password: "new password",
            token: resetToken,
        });
        expect(change.status).toBe(403);
    }));
    test("PUT /change-pass user attempt to change password with bad email", () => __awaiter(void 0, void 0, void 0, function* () {
        const resetToken = (0, utils_1.signToken)({
            resetEmail: "kdfjkdkfj@dkfjdkjf.com",
            uuid: uuid.v4(),
            exp: "5m",
        });
        const badEmail = yield (0, supertest_1.default)(app).put("/user/change-pass").send({
            password: "new password",
            token: resetToken,
        });
        expect(badEmail.status).toBe(400);
    }));
    test("PUT /change-pass user attempt to change password", () => __awaiter(void 0, void 0, void 0, function* () {
        const resetToken = (0, utils_1.signToken)({
            resetEmail: constants_1.TEST_EMAIL,
            uuid: uuid.v4(),
            exp: "5m",
        });
        const change = yield (0, supertest_1.default)(app).put("/user/change-pass").send({
            password: "new password",
            token: resetToken,
        });
        expect(change.status).toBe(200);
        expect(JSON.parse(change.text).done).toBe(true);
        expect(typeof JSON.parse(change.text).token).toBe("string");
    }));
    test("POST /user/login with the new password", () => __awaiter(void 0, void 0, void 0, function* () {
        const reset = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            usernameOrEmail: {
                username: constants_1.TEST_USERNAME,
            },
            password: "new password",
        });
        expect(reset.status).toBe(200);
    }));
    test("PUT /update-preset try update preset without data", () => __awaiter(void 0, void 0, void 0, function* () {
        const update = yield (0, supertest_1.default)(app)
            .put("/user/update-preset")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(update.status).toBe(400);
        expect(JSON.parse(update.text).error).toBe("missing preset name in request");
    }));
    test("PUT /update-preset a user's default preset", () => __awaiter(void 0, void 0, void 0, function* () {
        const update = yield (0, supertest_1.default)(app)
            .put("/user/update-preset")
            .set({
            authorization: `Bearer ${newUserToken}`,
        })
            .send({
            defaultPreset: "waves",
            animVarCoeff: "64",
        });
        const parsed = JSON.parse(update.text);
        expect(update.status).toBe(200);
        expect(typeof parsed.updated).toBe("string");
        expect(parsed.updated).toBe("waves");
    }));
    test("/PUT try to update preset with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidSig = yield (0, supertest_1.default)(app)
            .put("/user/update-preset")
            .set({
            authorization: `Bearer ${INVALID_SIGNATURE}`,
        })
            .send({
            usernameOrEmail: {
                username: constants_1.TEST_USERNAME,
                email: "",
            },
            password: constants_1.TEST_PASSWORD,
        });
        expect(invalidSig.status).toBe(403);
        const parsed = JSON.parse(invalidSig.text);
        expect(parsed.error.message).toBe("invalid token");
    }));
    test("/POST /user/add-preset add a new preset to the user's preset collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const add = yield (0, supertest_1.default)(app)
            .post("/user/add-preset")
            .send({
            presetName: "new preset",
            animVarCoeff: "55",
        })
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(add.status).toBe(200);
        const parsed = JSON.parse(add.text);
        expect(parsed.presets).toHaveLength(7);
        expect(typeof parsed.presets[6]._id).toBe("string");
        expect(parsed.presets[6].animVarCoeff).toBe("55");
        expect(parsed.presets[6].presetName).toBe("new preset");
    }));
    test("/GET /user/presets get user's preset collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const presets = yield (0, supertest_1.default)(app)
            .get("/user/presets")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(presets.status).toBe(200);
        const parsed = JSON.parse(presets.text);
        expect(parsed.presets).toHaveLength(7);
        expect(parsed.presets[6].presetName).toBe("new preset");
        expect(parsed.presets[6].animVarCoeff).toBe("55");
    }));
    test("deletes the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=user.test.js.map
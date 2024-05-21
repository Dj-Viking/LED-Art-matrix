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
const uuid = require("uuid");
const { data: base64StringOfWebPImage } = require("../testutils/base64String.json");
const constants_1 = require("../constants");
const testServer_1 = require("../testServer");
const node_fetch_1 = __importDefault(require("node-fetch"));
const models_1 = require("../models");
const base64ToBlob_1 = require("../utils/base64ToBlob");
let app;
let newUserToken = "";
let newUserId = "";
describe("test the CRUD on gifs", () => {
    beforeEach(() => {
        app = (0, testServer_1.createTestServer)();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(constants_1.TEST_DB_URL);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (newUserId) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield models_1.User.deleteOne({ _id: newUserId });
            }))();
        }
        mongoose_1.default.connection.db.dropDatabase().then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
        }));
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
    test("when array of blobs for gif strings are sent to server\
    can parse those blobs as strings again and then save to database", () => __awaiter(void 0, void 0, void 0, function* () {
        const fileblob = (0, base64ToBlob_1.base64ToBlob_Server)(base64StringOfWebPImage, "image/webp");
        const fileBuf = Buffer.from(yield fileblob.text());
        const res = yield (0, supertest_1.default)(app)
            .post("/gifs/saveGifsAsStrings")
            .set({
            authorization: `Bearer ${newUserToken}`,
        })
            .attach("gif image", fileBuf, "test gif");
        expect(res.status).toBe(200);
    }));
    test("get gifs and then download the files on the server and then\
    use the files downloaded from the gif links to send to the client", () => __awaiter(void 0, void 0, void 0, function* () {
        const gifs = yield (0, supertest_1.default)(app).get("/gifs/getGifsAsDataStrings");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text);
        expect(parsed.gifs.length).toBe(1);
        const gif = parsed.gifs[0];
        expect(gif.gifSrcs[0].length).toBeGreaterThan(1000);
    }));
    test("get gifs again to replace the previous gifs", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalFetch = node_fetch_1.default;
        node_fetch_1.default = jest.fn();
        node_fetch_1.default.mockImplementation(() => {
            return Promise.resolve({
                json: () => {
                    return Promise.resolve(constants_1.MOCK_GIPHY_RES);
                },
            });
        });
        const gifs = yield (0, supertest_1.default)(app).get("/gifs/unloggedGet");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text);
        expect(parsed.gifs.length).toBe(1);
        const gif = parsed.gifs[0];
        expect(typeof gif._id).toBe("string");
        expect(typeof gif.listName).toBe("string");
        expect(typeof gif.listOwner).toBe("string");
        expect(Array.isArray(gif.gifSrcs)).toBe(true);
        expect(gif.gifSrcs.length).toBeTruthy();
        node_fetch_1.default = originalFetch;
    }));
});
//# sourceMappingURL=gifs.test.js.map
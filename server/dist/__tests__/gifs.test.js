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
const constants_1 = require("../constants");
const testServer_1 = require("../testServer");
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = (0, testServer_1.createTestServer)();
describe("test the CRUD on gifs", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(constants_1.TEST_DB_URL);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoose_1.default.connection.db.dropDatabase().then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
        }));
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
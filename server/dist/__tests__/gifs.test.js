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
const app = (0, testServer_1.createTestServer)();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(constants_1.TEST_DB_URL, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
}));
let _gifs = null;
describe("test the CRUD on gifs", () => {
    test("gifs can be fetched", () => __awaiter(void 0, void 0, void 0, function* () {
        const gifs = yield (0, supertest_1.default)(app).get("/gifs/get");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text);
        expect(parsed.gifs.length > 0).toBe(true);
        _gifs = parsed.gifs;
    }));
    test("get gifs again to replace the previous gifs", () => __awaiter(void 0, void 0, void 0, function* () {
        const gifs = yield (0, supertest_1.default)(app).get("/gifs/get");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text);
        expect(parsed.gifs.length > 0).toBe(true);
        expect(_gifs).not.toStrictEqual(parsed.gifs);
    }));
});
//# sourceMappingURL=gifs.test.js.map
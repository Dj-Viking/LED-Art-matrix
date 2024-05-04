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
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const router_1 = __importDefault(require("./router"));
const PORT = process.env.PORT || 3001;
const corsRegexp = (() => new RegExp(constants_1.APP_DOMAIN_PREFIX, "g"))();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: constants_1.IS_PROD ? corsRegexp : "http://localhost:3000",
    credentials: true,
}));
app.use(router_1.default);
const connection_1 = __importDefault(require("./config/connection"));
const models_1 = require("./models");
function seedSearchTerms() {
    return __awaiter(this, void 0, void 0, function* () {
        const getSearchTerm = yield models_1.SearchTerm.find();
        if (getSearchTerm[0] === undefined) {
            yield models_1.SearchTerm.create({
                termText: "trippy",
                termCategory: "trippy",
                limit: "10",
            });
        }
        else {
            console.log("\x1b[37m", "starting categories already seeded...", "\x1b[00m");
        }
    });
}
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.resolve("../client/build")));
    app.get("*", (_, res) => {
        console.log("IN THE GET STAR");
        res.sendFile(path_1.default.resolve("../client/build/index.html"));
    });
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") {
            res.redirect(`https://${req.header("host")}${req.url}`);
        }
        next();
    });
}
connection_1.default.once("open", () => {
    console.log("mongodb connection opened");
    app.listen(PORT, () => {
        setTimeout(() => {
            console.log("\x1b[33m", `🔊 🎶 now listening on port ${PORT} 🔊 🎶`, "\x1b[00m");
        }, 300);
        setTimeout(() => {
            console.log("\x1b[33m", `🌎 node environment install success listening on port ${PORT} 🌎`, "\x1b[00m");
        }, 400);
        setTimeout(() => {
            console.log("\x1b[32m", `🌱 if in development: stand by for react server to begin...`, "\x1b[00m");
        }, 600);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield seedSearchTerms();
        }), 800);
    });
});
//# sourceMappingURL=index.js.map
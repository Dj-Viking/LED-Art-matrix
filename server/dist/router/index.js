"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const userRoutes_1 = __importDefault(require("./userRoutes"));
const gifRoutes_1 = __importDefault(require("./gifRoutes"));
router.use("/user", userRoutes_1.default);
router.use("/gifs", gifRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
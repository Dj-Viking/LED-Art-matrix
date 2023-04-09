"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const { makeNewCollection, getMyGifs, getGifs } = controllers_1.GifsController;
router.route("/unloggedGet").get(getGifs);
router.route("/get").get(middleware_1.authMiddleware, getMyGifs);
router.route("/createNewCollection").post(middleware_1.authMiddleware, makeNewCollection);
exports.default = router;
//# sourceMappingURL=gifRoutes.js.map
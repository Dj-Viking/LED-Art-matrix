"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const { makeNewCollection, getMyGifs, getGifs, storedGifs } = controllers_1.GifsController;
router.route("/unloggedGet").get(getGifs);
router.route("/get").get(middleware_1.authMiddleware, getMyGifs);
router.route("/storedGifs").get(middleware_1.authMiddleware, storedGifs);
router.route("/createNewCollection").post(middleware_1.authMiddleware, makeNewCollection);
exports.default = router;
//# sourceMappingURL=gifRoutes.js.map
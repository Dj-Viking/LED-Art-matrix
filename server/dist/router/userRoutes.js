"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const { getUserDefaultPreset, login, updateDefaultPreset, signup, forgotPassword, changePassword } = controllers_1.UserController;
router.route("/").get(middleware_1.accessControl, middleware_1.authMiddleware, getUserDefaultPreset).post(signup);
router.route("/update-preset").put(middleware_1.accessControl, middleware_1.authMiddleware, updateDefaultPreset);
router.route("/login").post(middleware_1.accessControl, login);
router.route("/forgot").post(middleware_1.accessControl, forgotPassword);
router.route("/change-pass").put(changePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
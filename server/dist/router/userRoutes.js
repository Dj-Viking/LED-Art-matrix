"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const { authMiddleware, accessControl } = require("../middleware");
const { getUserDefaultPreset, login, updateDefaultPreset, signup, forgotPassword, changePassword } = controllers_1.UserController;
router.route("/").get(accessControl, authMiddleware, getUserDefaultPreset).post(signup);
router.route("/update-preset").put(accessControl, authMiddleware, updateDefaultPreset);
router.route("/login").post(accessControl, login);
router.route("/forgot").post(accessControl, forgotPassword);
router.route("/change-pass").put(changePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
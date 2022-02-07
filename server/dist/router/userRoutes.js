"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const { getUserDefaultPreset, login, addNewPreset, getUserPresets, updateDefaultPreset, signup, forgotPassword, changePassword, } = controllers_1.UserController;
router.route("/").post(signup);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);
router.route("/update-preset").put(middleware_1.authMiddleware, updateDefaultPreset);
router.route("/").get(middleware_1.authMiddleware, getUserDefaultPreset);
router.route("/add-preset").post(middleware_1.authMiddleware, addNewPreset);
router.route("/presets").get(middleware_1.authMiddleware, getUserPresets);
router.route("/change-pass").put(changePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
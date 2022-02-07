const router = require("express").Router();
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
const {
  getUserDefaultPreset,
  login,
  addNewPreset,
  getUserPresets,
  updateDefaultPreset,
  signup,
  forgotPassword,
  changePassword,
} = UserController;

// /user
router.route("/").post(signup);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);

// need auth
router.route("/update-preset").put(authMiddleware, updateDefaultPreset);
router.route("/").get(authMiddleware, getUserDefaultPreset);
router.route("/add-preset").post(authMiddleware, addNewPreset);
router.route("/presets").get(authMiddleware, getUserPresets);

// reset token is handled in the endpoint, maybe use middleware??
router.route("/change-pass").put(changePassword);

export default router;

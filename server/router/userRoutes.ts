const router = require("express").Router();
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
const {
    deleteUserPreset,
    getUserDefaultPreset,
    login,
    addNewPreset,
    getUserPresets,
    updateDefaultPreset,
    signup,
    forgotPassword,
    changePassword,
    createGifCollection,
    removeGifCollection,
} = UserController;

// /user
router.route("/").post(signup);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);

// need auth
router.route("/delete-preset").delete(authMiddleware, deleteUserPreset);
router.route("/update-preset").put(authMiddleware, updateDefaultPreset);
router.route("/").get(authMiddleware, getUserDefaultPreset);
router.route("/add-preset").post(authMiddleware, addNewPreset);
router.route("/presets").get(authMiddleware, getUserPresets);
router.route("/createGifCollection").post(authMiddleware, createGifCollection);
router.route("/removeGifCollection").delete(authMiddleware, removeGifCollection);

// reset token is handled in the endpoint, maybe use middleware??
router.route("/change-pass").put(changePassword);

export default router;

const router = require("express").Router();
const { UserController } = require("../controllers");
const { authMiddleware, accessControl } = require("../middleware");
const { getUserDefaultPreset, getAllUsers, login, updateDefaultPreset, signup, forgotPassword } = UserController;

router.route("/")
  .get(accessControl, authMiddleware, getUserDefaultPreset)
  .post(signup);

router.route("/all")
  .get(getAllUsers);

router.route("/update-preset")
  .put(accessControl, authMiddleware, updateDefaultPreset)

router.route("/login")
  .post(accessControl, login);

router.route("/forgot")
  .post(accessControl, forgotPassword);

module.exports = router;
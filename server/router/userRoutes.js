const router = require("express").Router();
const { UserController } = require("../controllers");
const { authMiddleware } = require("../utils/authMiddleware");
const { getUserDefaultPreset, login, updateDefaultPreset, signup } = UserController;

router.route("/")
  .get(authMiddleware, getUserDefaultPreset)
  .post(signup);
router.route("/update-preset")
  .put(authMiddleware, updateDefaultPreset)
router.route("/login")
  .post(login);


module.exports = router;
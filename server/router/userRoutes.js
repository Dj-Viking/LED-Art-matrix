const router = require("express").Router();
const { UserController } = require("../controllers");
const { authMiddleware, accessControl } = require("../middleware");
const { getUserDefaultPreset, login, updateDefaultPreset, signup } = UserController;

router.route("/")
  .get(accessControl, authMiddleware, getUserDefaultPreset)
  .post(signup);
router.route("/update-preset")
  .put(accessControl, authMiddleware, updateDefaultPreset)
router.route("/login")
  .post(accessControl, login);


module.exports = router;
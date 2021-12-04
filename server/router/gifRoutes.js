const router = require("express").Router();
const { GifsController } = require("../controllers/GifsController");
const { getGifsAndOrUpdate } = GifsController;

router.route("/get").get(getGifsAndOrUpdate);

module.exports = router;
const router = require("express").Router();
const { GifsController } = require("../controllers/GifsController");
const { getGifsAndOrUpdate } = GifsController;

router.route("/getGifs").get(getGifsAndOrUpdate);

module.exports = router;
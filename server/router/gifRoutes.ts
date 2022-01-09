const router = require("express").Router();
import { GifsController } from "../controllers/GifsController";
const { getGifsAndOrUpdate } = GifsController;

router.route("/get").get(getGifsAndOrUpdate);

export default router;
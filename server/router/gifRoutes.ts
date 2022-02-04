const router = require("express").Router();
import { GifsController } from "../controllers";
const { getGifsAndOrUpdate } = GifsController;

router.route("/get").get(getGifsAndOrUpdate);

export default router;

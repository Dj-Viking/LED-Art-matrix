const router = require("express").Router();
import { GifsController } from "../controllers";
import { authMiddleware } from "../middleware";
const {
    makeNewCollection,
    getMyGifs,
    unloggedGet,
    storedGifs,
    getGifsAsDataStrings,
    saveGifsAsStrings,
} = GifsController;

// no need for auth
router.route("/unloggedGet").get(unloggedGet);
router.route("/getGifsAsDataStrings").get(getGifsAsDataStrings);

// need auth
router.route("/get").get(authMiddleware, getMyGifs);
router.route("/storedGifs").get(authMiddleware, storedGifs);
router.route("/createNewCollection").post(authMiddleware, makeNewCollection);
router.route("/saveGifsAsStrings").post(authMiddleware, saveGifsAsStrings);

export default router;

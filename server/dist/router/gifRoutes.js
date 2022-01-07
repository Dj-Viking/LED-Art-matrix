"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const GifsController_1 = require("../controllers/GifsController");
const { getGifsAndOrUpdate } = GifsController_1.GifsController;
router.route("/get").get(getGifsAndOrUpdate);
exports.default = router;
//# sourceMappingURL=gifRoutes.js.map
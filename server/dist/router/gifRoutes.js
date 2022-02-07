"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const controllers_1 = require("../controllers");
const { getGifsAndOrUpdate } = controllers_1.GifsController;
router.route("/get").get(getGifsAndOrUpdate);
exports.default = router;
//# sourceMappingURL=gifRoutes.js.map
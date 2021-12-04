const router = require("express").Router();
const userRoutes = require("./userRoutes");
const gifRoutes = require("./gifRoutes");
const presetRoutes = require("./presetRoutes");

router.use("/preset", presetRoutes);
router.use("/user", userRoutes);
router.use("/gifs", gifRoutes);

module.exports = router;
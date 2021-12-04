const router = require("express").Router();
const userRoutes = require("./userRoutes");
const gifRoutes = require("./gifRoutes");

router.use("/user", userRoutes);
router.use("/gifs", gifRoutes);

module.exports = router;
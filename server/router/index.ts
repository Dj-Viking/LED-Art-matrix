const router = require("express").Router();
import userRoutes from "./userRoutes";
import gifRoutes from "./gifRoutes";

router.use("/user", userRoutes);
router.use("/gifs", gifRoutes);

export default router;
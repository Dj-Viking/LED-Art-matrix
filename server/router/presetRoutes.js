const router = require("express").Router();
const { Preset } = require("../models");

router.route("/all").get(async (_, res) => {
  try {
    const all = await Preset.find({});
    return res.status(200).json({ all });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
});


module.exports = router;
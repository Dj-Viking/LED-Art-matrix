const { authMiddleware } = require("./authMiddleware");
const { accessControl } = require("./accessControl");
module.exports = { authMiddleware, accessControl };
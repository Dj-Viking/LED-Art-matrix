// const { APP_DOMAIN_PREFIX } = require("../constants");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns {Promise<void>}
 */
function accessControl (_, _, next) {
  // turns out cors package is handling all this stuff...

  // res.setHeader("Access-Control-Allow-Origin", APP_DOMAIN_PREFIX);
  // res.header("Access-Control-Allow-Headers", ["Origin", "X-Requested-With", "Content-Type", "Accept"]);
  // res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
  return next();
}

module.exports = { accessControl };

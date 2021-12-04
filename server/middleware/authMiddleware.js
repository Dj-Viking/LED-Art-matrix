const jwt = require('jsonwebtoken');
const { verifyAsync } = require("../utils/verifyAsync");
require('dotenv').config();
const { EXPIRATION, SECRET } = process.env;


module.exports = {
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @param {import("express").NextFunction} next 
   * @returns {Promise<import("express").Response | void>}
   */
  authMiddleware: function (req, res, next) {
    let token = null;
    
    if (req.headers && req.headers.authorization) {
      if (typeof req.headers.authorization === "string") {
        token = req.headers.authorization.split(" ")[1].trim()
      }
    }

    if (!token) {
      return res.status(401).json({error: "not authenticated"});
    }

    verifyAsync(token)
    .then((decoded) => {
      if (decoded instanceof Error)
        return res.status(403).json({ error: decoded });
      req.user = decoded; // this isn't TS so we haven't done any declaration merging yet but this is fine
      return next();
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    });
    
  },
};
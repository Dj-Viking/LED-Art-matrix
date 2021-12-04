require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  SECRET,
  EXPIRATION
} = process.env;

/**
   * 
   * @param {{username?: string, email?: string, _id?: string, resetEmail?: string, uuid?: string, exp?: string}} args 
   * @returns {string} jwt token as as string can be decoded into an object
   */
 function signToken(args) {
  const { username, email, _id, resetEmail, uuid, exp } = args
  switch(true) {
    case Boolean(username && email && _id && uuid): {
      return jwt.sign({
        username,
        email,
        uuid,
        _id
      },
      SECRET,
      { expiresIn: EXPIRATION });
    }
    case Boolean(resetEmail && uuid && exp): {
      return jwt.sign({
        uuid,
        resetEmail
      },
      SECRET,
      { expiresIn: exp }); //should be 5 minutes pass in as an arg
    }
    default: return null;
  }
}

module.exports = { signToken };
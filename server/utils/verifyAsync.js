const jwt = require("jsonwebtoken");
const {
  SECRET,
  EXPIRATION
} = process.env;
/**
   * 
   * @param {string} token input token to verify
   * @returns {Promise<{username?: string, email?: string, _id?: string, resetEmail?: string, uuid?: string, exp?: string}>} a decoded profile token
   */
 async function verifyAsync(token) {
  let returnMe;
  return new Promise((resolve) => {
    jwt.verify(token, SECRET, { maxAge: EXPIRATION }, (err, decoded) => {
      if (!!err.message) returnMe = err;
      if (decoded) returnMe = decoded;
    });
    resolve(returnMe);
  });
}

module.exports = {
  verifyAsync
};
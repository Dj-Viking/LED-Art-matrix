const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
/**
   * 
   * @param {string} token input token to verify
   * @returns {Promise<{username?: string, email?: string, _id?: string, resetEmail?: string, uuid?: string, exp?: string}>} a decoded profile token
   */
 async function verifyAsync(token) {
  let returnMe;
  return new Promise((resolve) => {
    jwt.verify(token, SECRET, { maxAge: process.env.EXPIRATION }, (err, decoded) => {
      if (err && err.message.includes("invalid")) returnMe = "invalid token";
      if (err && err.message.includes("expired")) returnMe = "expired token";
      if (err && err.message.includes("malformed")) returnMe = "invalid token";
      if (decoded) returnMe = decoded;
    });
    resolve(returnMe);
  });
}

module.exports = {
  verifyAsync
};
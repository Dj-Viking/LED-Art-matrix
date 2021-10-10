/**
 * @type {boolean}
 */
const IS_PROD = process.env.NODE_ENV === "production";


const APP_DOMAIN_PREFIX = IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3000";


module.exports = {
  IS_PROD,
  APP_DOMAIN_PREFIX
}
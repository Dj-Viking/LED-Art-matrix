require("dotenv").config();
export const IS_PROD = process.env.NODE_ENV === "production";
export const APP_DOMAIN_PREFIX = IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3000";

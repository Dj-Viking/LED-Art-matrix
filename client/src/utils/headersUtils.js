import { IS_PROD, API_URL } from "../constants";
/**
 * 
 * @param {object} headers 
 * @returns {{
 *   "Access-Control-Allow-Credentials": "true",
 *   "Access-Control-Allow-Origin": string | "http://localhost:3000",
 *   "Content-Type": "application/json",
 *   "Access-Control-Allow-Methods": [
 *      "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
 *   ]
 * }} headers we want for each request
 */
export function setInitialHeaders(headers) {
  headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": IS_PROD ? API_URL : "http://localhost:3000",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  };
  return headers;
}
/**
 * 
 * @param {object} headers 
 * @param {string} token 
 * @returns {Headers}
 */
export function setAuthHeader(headers, token) {
  if (!token) throw new TypeError(`token passed must be a string!`);
  headers = {
    ...headers,
    "authorization": `Bearer ${token}`
  }
  return headers;
}
/**
 * 
 * @param {Headers} headers 
 * @returns {Headers} empty headers
 */
export function clearHeaders(headers) {
  headers = {};
  return headers;
}
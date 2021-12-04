/**
 * 
 * @param {object} headers 
 * @returns {{
 *   "Content-Type": "application/json",
 * }} headers we want for each request
 */
export function setInitialHeaders(headers) {
  headers = {
    "Content-Type": "application/json",
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
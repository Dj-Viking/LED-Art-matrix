/**
 * 
 * @param {Number} _min 
 * @param {Number} _max 
 * @returns {Number} random number between the range given between min and max
 */
export function getRandomIntLimit(_min, _max) {
  let min = Math.ceil(_min);
  let max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
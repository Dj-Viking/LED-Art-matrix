/**
 * 
 * @param {number} _min 
 * @param {number} _max 
 * @returns {number} random number between the min and max
 */
function getRandomIntLimit(_min, _max) {
  let min = Math.ceil(_min);
  let max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = { getRandomIntLimit };
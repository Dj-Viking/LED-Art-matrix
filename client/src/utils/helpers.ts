/**
 *
 * @param {Number} _min lower range of numbers to randomize between
 * @param {Number} _max upper range of numbers to randomize between
 * @returns {Number} random number between the range given between min and max
 */
export function getRandomIntLimit(_min: number, _max: number): number {
    const min = Math.ceil(_min);
    const max = Math.floor(_max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

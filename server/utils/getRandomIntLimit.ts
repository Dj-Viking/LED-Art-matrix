export function getRandomIntLimit(min: number, max: number): number {
  let _min = Math.ceil(min);
  let _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min) + _min); //The maximum is exclusive and the minimum is inclusive
}
/**
 * @see https://stackoverflow.com/questions/42110701/how-to-calculate-percentage-between-the-range-of-two-values-a-third-value-is-in
 * @param input input value to determine what position in the range the number sits
 * @param minPercentage minimum percentage value
 * @param maxPercentage maximum percentage value
 * @param minInput minimum input value the range can be
 * @param maxInput maximum input value the range can be
 * @returns the precentage calculation value from the input given the range the input number lies within
 */
export function calcPositionFromRange(
  input: number, 
  minPercentage: number, 
  maxPercentage: number, 
  minInput: number, 
  maxInput: number
): number {
  return Math.floor(
      (maxPercentage - minPercentage) * (input - minInput) / (maxInput - minInput) + minPercentage
    );
}
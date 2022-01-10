export const IS_PROD = process.env.NODE_ENV === "production";
export const API_URL = IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3001";
export const RAINBOW_TEST_ANIMATION = `
@keyframes rainbowTestAllAnim {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const RAINBOW_V2_ANIMATION = `
@keyframes V2 {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const WAVES_ANIMATION = `
@keyframes waves {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const SPIRAL_ANIMATION = `
@keyframes spiral {
  0.001% {
    background-color: blue;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: red;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: white;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}
`;
export const FOUR_SPIRALS_ANIMATION = `
@keyframes fourSpirals {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const DM5_ANIMATION = `
@keyframes dm5 {
  0.001% {
    background-color: lime;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: black;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: black;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: lime;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;

// preset animation delays and duration calculators
export function rainbowTestDelay(led: number, row: number): string {
  return `
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 64) + led / (row / led) / 32}s;
    animation-direction: alternate;
    animation-timing-function: ease-in;
  `;
}

export function V2Delay(led: number, row: number): string {
  return `
    animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
}

export function wavesDelay(led: number, row: number): string {
  return `
    animation-duration: ${(led / 32) + (row / led)}s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
}

export function spiralDelay(led: number, row: number): string {
  return `
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 32) + (led * (row / 16))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
}

export function fourSpiralsDelay(led: number, row: number): string {
  return `
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 32) + (led * (row / 8))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
}

export function dm5Delay(led: number, row: number): string {
  return `
    animation-duration: ${led <= 3 ? 1 : (led / 3.14159) / 2}s;
    animation-iteration-count: infinite;
    animation-delay: ${(row % 5 === 0 ? (led / 3.14159) : led / 20)}s;
    animation-direction: alternate;
    animation-timing-function: ease-in;
  `;
}
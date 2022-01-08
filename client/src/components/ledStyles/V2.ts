/**
 * @param {HTMLElement} tag style tag to add css text to
 * @returns {HTMLElement} adds text to a style element and 
 * appends it to the body
 */
 export function rainbowV2(tag: HTMLElement): HTMLElement {
   const _tag = tag;
  _tag.textContent = `
  @keyframes rainbowV2Anim {
    0% {
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
  }
  ${createRainbowV2LedClass()}
  `;

  return _tag;
}
/**
 * 
 * @param {number} led 
 * @param {number} row 
 * @returns {string}
 */
 export function createRainbowV2Delays(led: number, row: number): string {
  let columnDelays = "";
  columnDelays += `
    animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
  return columnDelays;
}
/**
 * creates the css text to inject into the styleTag appended to <head>
 * @returns {string}
 */
 export function createRainbowV2LedClass(): string {
  let ledClass = "";
  for (let row = 0; row < 33; row++) {
    for (let led = 0; led < 33; led++) {
      ledClass += `
        .led${led}-${row}V2 {
          animation-name: rainbowV2Anim;
          ${createRainbowV2Delays(led, row)}
          display: flex;
          flex-direction: row;
          border-radius: 3px;
          background: transparent;
          width: 10vw;
          height: 3vh;
          position: relative;
        }
      `;
    }
  }
  return ledClass;
}

/**
 * @param {HTMLElement} tag style tag to add css text to
 * @returns {HTMLElement} adds text to a style element and 
 * appends it to the body
 */
 export function dm5(tag: HTMLElement): HTMLElement {
  const _tag = tag;
  _tag.textContent = `
  @keyframes dm5 {
    0% {
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
  }
  ${createDM5LedClass()}
  `;
  
  return _tag;
}
/**
 * creates the css text to inject into the styleTag appended to <head>
 * @returns {string}
 */
function createDM5LedClass(): string {
  let ledClass = "";
  for (let row = 0; row < 33; row++) {
    for (let led = 0; led < 33; led++) {
      ledClass += `
        .led${led}-${row}dm5 {
          animation-name: dm5;
          ${createDM5Delays(led, row)}
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

// DM5 modulus preset
// anim delay
//      animation-duration: ${led % 2 && led % 3 === 0 ? (led / 3.14159) : led / 20}s;
// anim duration
//      animation-delay: ${(row % 5 === 0 ? (led / 3.14159) : led / 20)}s;
/**
 * 
 * @param {number} led 
 * @param {number} row 
 * @returns {string}
 */
function createDM5Delays(led: number, row: number): string {
  let columnDelays = "";
  columnDelays += `
    animation-duration: ${led <= 3 ? 1 : (led / 3.14159) / 2}s;
    animation-iteration-count: infinite;
    animation-delay: ${(row % 5 === 0 ? (led / 3.14159) : led / 20)}s;
    animation-direction: alternate;
    animation-timing-function: ease-in;
  `;
  return columnDelays;
}

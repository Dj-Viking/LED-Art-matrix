/**
 * @param {HTMLElement} tag style tag to add css text to
 * @returns {HTMLElement} adds text to a style element and 
 * appends it to the body
 */
export function spiral(tag) {
  tag.textContent = `
  @keyframes spiral {
    0% {
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
  ${createSpiralLedClass()}
  `;

  return tag;
}

/**
 * 
 * @param {number} led 
 * @param {number} row 
 * @returns {string}
 */
export function createSpiralDelays(led, row) {
  let columnDelays = "";
  columnDelays += `
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 32) + (led * (row / 16))}s;
    animation-direction: reverse;
    animation-timing-function: ease-in;
  `;
  return columnDelays;
}

/**
 * creates the css text to inject into the styleTag appended to <head>
 * @returns {string}
 */
 export function createSpiralLedClass() {
  let ledClass = "";
  for (let row = 0; row < 33; row++) {
    for (let led = 0; led < 33; led++) {
      ledClass += `
        .led${led}-${row}spiral {
          animation-name: spiral;
          ${createSpiralDelays(led, row)}
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
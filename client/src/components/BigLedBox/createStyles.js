/**
 * writeLedColumnStyles = (row) => {
  let columnStyle = '';
  for (let i = 1; i < 33; i++) {
    columnStyle += `
    .led${i}-${row}{
      @include rainbowFourSpirals();
      @include row${i}-${row}DelayFourSpirals();
      display: flex;
      flex-direction: row;
      border-radius: 3px;
      background: transparent;
      width: 10vw;
      height: 3vh;
      position: relative;
    }`;
  }
  return columnStyle;
}

 */
/**
 * writeLedColumnDelays = (row) => {
  let columnDelays = '';
  for (let i = 1; i < 33; i++) {
    columnDelays += `
    @mixin row${i}-${row}DelayFourSpirals {
      animation-name: rainbowFourSpiralsAnim;
      animation-duration: 4s;
      animation-iteration-count: infinite;
      animation-delay: ${(i / 64) + i / (row / i - ( 2 * row))}s;
      /*animation-direction: reverse;
      animation-direction: alternate;
      /*animation-timing-function: linear;
      animation-timing-function: ease-in;
      /* animation-timing-function: ease-out; 
      /*animation-timing-function: ease-in-out;
    }
    `
  }
  return columnDelays;
}
 */
/**
 * 
 * @param {HTMLElement} tag style tag to append to head
 */

export function appendStyle(tag) {
  document.head.appendChild(tag);
}
/**
 * 
 * @param {HTMLElement} tag style tag to remove from head
 */
export function removeStyle(tag) {
  document.head.removeChild(tag);
}

/**
 * @param {HTMLElement}
 * @returns {void} adds text to a style element and 
 * appends it to the body
 */
export function rainbowTest(tag) {
  tag.textContent = `
  @keyframes rainbowTestAllAnim {
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
  ${createLedClass()}
  `;
  
  return tag;
}


export function createRainbowDelays(led, row) {
  let columnDelays = "";
  columnDelays += `
    animation-name: rainbowFourSpiralsAnim;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-delay: ${(led / 64) + led / (row / led) / 32}s;
    animation-direction: alternate;
    animation-timing-function: ease-in;
  `;
  return columnDelays;
}
//  animation-delay: ${(i / 64) + i / (row / i - ( 2 * row))}s;

export function createLedClass() {
  let ledClass = "";
  for (let row = 0; row < 33; row++) {
    for (let led = 0; led < 33; led++) {
      ledClass += `
        .led${led}-${row} {
          animation-name: rainbowTestAllAnim;
          ${createRainbowDelays(led, row)}
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


/**
 * 
 * @returns {import("react").StyleHTMLAttributes}
 */
export function ledRowStyle() {
  return {
    display: "flex",
    flexDirection: "row"
  }
}
/**
 * 
 * //RAINBOW DELAY
//  animation-delay: ${(i / 64) + i / (row / i - ( 2 * row))}s;
 * 
 * 
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
//SPIRAL
// delay??
//// (i / 32) + (i * (num / 10)) 

// duration??
//(i / 16) + (i / (2 * num))

//waves duration
animation-duration: ${(led / 32) + (row / led)}s;

//standard i / 32 delay
// (i / 32)

//pretty cool  parabola
//(i / 16) + i / (num / i - (2 * num)) animation delay (start time)?? or animation duration
//(i / 16) + i / (num / i - (4 * num))

//big parabola good with different animation lengths
//(i / 64) + ( i / num * (.05 * i))

//bouncy counter rain
//${i / num}

//4 spirals
//(i / 16) + (i * (num / 16))

//BLANK PRESET
//anim direction: alternate
//anim duration: 4s
//anim delay: (index / 16) + (index / (2 * row.rowNumber))
 */
export function ledRowStyle(): { display: string, flexDirection: string } {
  return {
    display: "flex",
    flexDirection: "row"
  };
}

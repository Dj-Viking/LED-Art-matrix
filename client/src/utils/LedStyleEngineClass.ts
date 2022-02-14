/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { 
  DM5_ANIMATION, 
  FOUR_SPIRALS_ANIMATION, 
  RAINBOW_TEST_ANIMATION, 
  RAINBOW_V2_ANIMATION, 
  SPIRAL_ANIMATION,  
  WAVES_ANIMATION 
} from "../constants";
export class LedStyleEngine {
  private preset!: string;

  constructor(preset: string) {
    this.preset = preset;
  }
  // TODO: make this function to determine a delay coefficient to constantly render an input coefficient for an type of
  // animation delay which can change per render cycle of react, so on a useeffect I guess we just generate different
  // coeffecients on each render trigger and the LED style should update during a slider on change event
  /**
   * @param coeff optional coefficient argument set default 1 will change on react state changes on sliders
   * @returns just a css string to add as "HTML" to a style tag
   */
  public createStyleSheet(coeff: string): string {
    return this.generateStyle(coeff);
  }
  private generateStyle(coeff: string): string {
    let str = "";
    switch (this.preset) {
      case "rainbowTest":
        str = `
          ${RAINBOW_TEST_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
      case "v2":
        str = `
          ${RAINBOW_V2_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
      case "waves": 
        str = `
          ${WAVES_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
      case "spiral":
        str = `
          ${SPIRAL_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
      case "fourSpirals":
        str = `
          ${FOUR_SPIRALS_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
      case "dm5": 
        str = `
          ${DM5_ANIMATION}
          ${this.createLedClass(coeff)}
        `;
      break;
    }
    return str;
  }

  
  private createLedClass(coeff: string): string {
    let ledClass = "";
    for (let row = 1; row < 33; row++) {
      for (let led = 1; led < 33; led++) {
        ledClass += this.generateLedClass(led, row, coeff); //appending with += because this is procedural for each column and row
      }
    }
    return ledClass;
  }

  private generateLedClass(led: number, row: number, coeff: string): string {
    return `
      .led${led}-${row}${this.preset} {
        animation-name: ${this.preset};
        ${this.createDelays(led, row, coeff)}
        display: flex;
        flex-direction: row;
        border-radius: 5px;
        background: transparent;
        width: 10vw;
        height: 3vh;
        position: relative;
      }
    `;
  }

  private createDelays(led: number, row: number, coeff: string): string {
    let columnDelays = "";
    switch (this.preset) {
      case "rainbowTest": 
        columnDelays = this.rainbowTestDelay(led, row, coeff);
      break;
      case "v2": 
        columnDelays = this.V2Delay(led, row, coeff);
      break;
      case "waves": 
        columnDelays = this.wavesDelay(led, row, coeff);
      break;
      case "spiral":
        columnDelays = this.spiralDelay(led, row);
      break;
      case "fourSpirals":
        columnDelays = this.fourSpiralsDelay(led, row);
      break;
      case "dm5": 
        columnDelays = this.dm5Delay(led, row, coeff);
      break;
    }
    return columnDelays;
  }
  // preset animation delays and duration calculators
  private rainbowTestDelay(led: number, row: number, coeff: string): string {
    return `
      animation-duration: ${Number(coeff) / 100}s;
      animation-iteration-count: infinite;
      animation-delay: ${(led / 64) + led / (row / led) / ((Number(coeff) / 20) + (row / (Number(coeff) / 20)))}s;
      animation-direction: alternate;
      animation-timing-function: ease-in;
    `;
  }
  
  private V2Delay(led: number, row: number, coeff: string): string {
    // animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
    return `
      animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
      animation-iteration-count: infinite;
      animation-delay: ${(led / 16) + led / (row / led - ((Number(coeff) / 5) / 5))}s;
      animation-direction: reverse;
      animation-timing-function: ease-in;
    `;
  }
  
  private wavesDelay(led: number, row: number, coeff: string): string {
    // animation-duration: ${(led / 32) + (row / led)}s;
    return `
      animation-duration: ${(led / 32) + (row / led)}s;
      animation-iteration-count: infinite;
      animation-delay: ${(led / 16) + led / (row / led - (2 * Number(coeff)))}s;
      animation-direction: reverse;
      animation-timing-function: ease-in;
    `;
  }
  
  private spiralDelay(led: number, row: number): string {
    return `
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-delay: ${(led / 32) + (led * (row / 16))}s;
      animation-direction: reverse;
      animation-timing-function: ease-in;
    `;
  }
  
  private fourSpiralsDelay(led: number, row: number): string {
    return `
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-delay: ${(led / 32) + (led * (row / 8))}s;
      animation-direction: reverse;
      animation-timing-function: ease-in;
    `;
  }
  
  private dm5Delay(led: number, row: number, coeff: string): string {
    return `
      animation-duration: ${led <= 3 ? 1 : (led / 3.14159) / 2}s;
      animation-iteration-count: infinite;
      animation-delay: ${(row % 5 === 0 ? (led / 3.14159) : led / Number(coeff))}s;
      animation-direction: alternate;
      animation-timing-function: ease-in;
    `;
  }

}


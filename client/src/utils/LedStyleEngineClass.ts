import { 
  dm5Delay,
  DM5_ANIMATION, 
  fourSpiralsDelay, 
  FOUR_SPIRALS_ANIMATION, 
  rainbowTestDelay, 
  RAINBOW_TEST_ANIMATION, 
  RAINBOW_V2_ANIMATION, 
  spiralDelay, 
  SPIRAL_ANIMATION, 
  V2Delay, 
  wavesDelay, 
  WAVES_ANIMATION 
} from "../constants";
export class LedStyleEngine {
  private preset!: string;

  constructor(preset: string) {
    this.preset = preset;
  }
  /**
   * @returns just a css string to add as "HTML" to a style tag
   */
  public createStyleSheet(): string {
    return this.generateStyle();
  }
  private generateStyle(): string {
    let str = "";
    switch (this.preset) {
      case "rainbowTestAllAnim":
        str = `
          ${RAINBOW_TEST_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
      case "V2":
        str = `
          ${RAINBOW_V2_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
      case "waves": 
        str = `
          ${WAVES_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
      case "spiral":
        str = `
          ${SPIRAL_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
      case "fourSpirals":
        str = `
          ${FOUR_SPIRALS_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
      case "dm5": 
        str = `
          ${DM5_ANIMATION}
          ${this.createLedClass()}
        `;
      break;
    }
    return str;
  }

  private createLedClass(): string {
    let ledClass = "";
    for (let row = 1; row < 33; row++) {
      for (let led = 1; led < 33; led++) {
        ledClass += this.generateLedClass(led, row); //appending with += because this is procedural for each column and row
      }
    }
    return ledClass;
  }

  private generateLedClass(led: number, row: number): string {
    return `
      .led${led}-${row}${this.preset} {
        animation-name: ${this.preset};
        ${this.createDelays(led, row)}
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

  private createDelays(led: number, row: number): string {
    let columnDelays = "";
    switch (this.preset) {
      case "rainbowTestAllAnim": 
        columnDelays = rainbowTestDelay(led, row);
      break;
      case "V2": 
        columnDelays = V2Delay(led, row);
      break;
      case "waves": 
        columnDelays = wavesDelay(led, row);
      break;
      case "spiral":
        columnDelays = spiralDelay(led, row);
      break;
      case "fourSpirals":
        columnDelays = fourSpiralsDelay(led, row);
      break;
      case "dm5": 
        columnDelays = dm5Delay(led, row);
      break;
    }
    return columnDelays;
  }

}

import { DM5_ANIMATION, FOUR_SPIRALS_ANIMATION, RAINBOW_TEST_ANIMATION, RAINBOW_V2_ANIMATION, SPIRAL_ANIMATION, WAVES_ANIMATION } from "../constants";

type MyCreateStyleFunction = (tag: HTMLStyleElement) => HTMLStyleElement
export class LedStyleEngine {
  private preset!: string;

  constructor(preset: string) {
    this.preset = preset;
  }

  public createStyleFunction(): MyCreateStyleFunction {
    return (tag: HTMLStyleElement) => {
      const _tag = tag;
      _tag.textContent = this.createStyleSheet();
      return tag;
    };
  }

  public createLedClass(): string {
    let ledClass = "";
    for (let row = 0; row < 33; row++) {
      for (let led = 0; led < 33; led++) {
        switch (this.preset) {
          case "":
            ledClass += `
              .led${led}-${row} {
                animation-name: rainbowTestAllAnim;
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
          break;
          case "V2":
            ledClass += `
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
          break;
          case "waves":
            ledClass += `
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
          break;
          case "spiral":
            ledClass += `
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
          break;
          case "fourSpirals": 
          ledClass += `
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
          break;
          case "dm5":
            ledClass += `
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
          break;
          default: break;
        }
      }
    }
    return ledClass;
  }

  public createDelays(led: number, row: number): string {
    let columnDelays = "";
    switch (this.preset) {
      case "": 
        columnDelays = `
          animation-duration: 4s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 64) + led / (row / led) / 32}s;
          animation-direction: alternate;
          animation-timing-function: ease-in;
        `;
      break;
      case "V2": 
        columnDelays = `
          animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
          animation-direction: reverse;
          animation-timing-function: ease-in;
        `;
      break;
      case "waves": 
        columnDelays = `
          animation-duration: ${(led / 32) + (row / led)}s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
          animation-direction: reverse;
          animation-timing-function: ease-in;
        `;
      break;
      case "spiral":
        columnDelays = `
          animation-duration: 2s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 32) + (led * (row / 16))}s;
          animation-direction: reverse;
          animation-timing-function: ease-in;
        `;
      break;
      case "fourSpirals":
        columnDelays += `
          animation-duration: 2s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 32) + (led * (row / 8))}s;
          animation-direction: reverse;
          animation-timing-function: ease-in;
        `;
      break;
      case "dm5": 
        columnDelays += `
          animation-duration: ${led <= 3 ? 1 : (led / 3.14159) / 2}s;
          animation-iteration-count: infinite;
          animation-delay: ${(row % 5 === 0 ? (led / 3.14159) : led / 20)}s;
          animation-direction: alternate;
          animation-timing-function: ease-in;
        `;
      break;
      default: break;
    }
    return columnDelays;
  }

  public createStyleSheet(): string {
    let str = "";
    switch (this.preset) {
      case "":
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
      default: break;
    }
    return str;
  }

  public appendStyle(tag: HTMLStyleElement): void {
    document.head.appendChild(tag);
  }

  public removeStyle(tag: HTMLStyleElement): void {
    document.head.removeChild(tag);
  }
}

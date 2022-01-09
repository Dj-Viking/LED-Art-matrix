type MyFunction = (tag: HTMLStyleElement) => HTMLStyleElement
export class LedStyleEngine {
  private preset!: string;

  constructor(preset: string) {
    this.preset = preset;
  }

  // eslint-disable-next-line
  // @ts-ignore trying this out
  public createStyleFunction(): MyFunction {
    let func: MyFunction;
    if (this.preset === "") {
      func = (tag: HTMLStyleElement) => {
        const _tag = tag;
        tag.textContent = this.createStyleSheet();
        return _tag;
      };
    } else {
      func = (tag: HTMLStyleElement) => {
        const _tag = tag;
        tag.textContent = this.createStyleSheet();
        return _tag;
      };
    }
      console.log("function", func);
      
      return func;
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
        columnDelays += `
          animation-duration: 4s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 64) + led / (row / led) / 32}s;
          animation-direction: alternate;
          animation-timing-function: ease-in;
        `;
      
      break;
      case "V2": 
        columnDelays += `
          animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
          animation-iteration-count: infinite;
          animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
          animation-direction: reverse;
          animation-timing-function: ease-in;
        `;
      break;
      default: break;
    }
    return columnDelays;
  }

  public appendStyle(tag: HTMLStyleElement): void {
    document.head.appendChild(tag);
  }

  public removeStyle(tag: HTMLStyleElement): void {
    document.head.removeChild(tag);
  }

  public createStyleSheet(): string {
    let str = "";
    switch (this.preset) {
      case "":
        str = `
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
        ${this.createLedClass()}`;
      break;
      case "V2":
        str = `
        @keyframes V2 {
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
        ${this.createLedClass()}
        `;
      break;
      default: break;
    }
    return str;
  }
}

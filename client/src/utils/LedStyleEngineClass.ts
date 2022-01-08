export class LedStyleEngine {
  private preset!: string;

  constructor(preset: string) {
    this.preset = preset;
  }

  // eslint-disable-next-line
  // @ts-ignore trying this out
  public createStyleFunction(): Function {
    if (this.preset === "") {
      const rainbowTest = new Function("tag", `
      
      `);
    }
    if (this.preset === "V2") {
      const rainbowV2 = new Function("tag", `
      const _tag = tag;
      _tag.textContent = ${`
        @keyframes rainbow${this.preset}Anim {
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
        `};
  
        return _tag;`);
      console.log("function", rainbowV2);
      
      return rainbowV2;
    }
  }

  public createLedClass(): string {
    let ledClass = "";
    for (let row = 0; row < 33; row++) {
      for (let led = 0; led < 33; led++) {
        if (this.preset === "V2") {
          ledClass += `
            .led${led}-${row}${this.preset} {
              animation-name: rainbow${this.preset}Anim;
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
      }
    }
    return ledClass;
  }

  public createDelays(led: number, row: number): string {
    let columnDelays = "";
    if (this.preset === "V2") {
      columnDelays += `
        animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
        animation-iteration-count: infinite;
        animation-delay: ${(led / 16) + led / (row / led - (2 * row))}s;
        animation-direction: reverse;
        animation-timing-function: ease-in;
      `;
    }
    return columnDelays;
  }

  public appendStyle(tag: HTMLStyleElement): void {
    document.head.appendChild(tag);
  }

  public removeStyle(tag: HTMLStyleElement): void {
    document.head.removeChild(tag);
  }
}

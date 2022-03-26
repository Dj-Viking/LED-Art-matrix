import { SVG, Element as SVGElement } from "@svgdotjs/svg.js";


// create svg to render depending on a particular midi message

interface IMySVG {
  isFader: boolean;
  isKnob: boolean;
  type: string;
}

class MySVG implements IMySVG {
  public isFader = false;
  public isKnob = false;
  public type = "";
  constructor (type = "") {
    this.type = type;
  }

  public drawFader(type: string): void {
    this.type = type;
    if (document.querySelector("#fader-svg") !== null) {
      const draw = SVG()
        .addTo(document.querySelector("#fader-svg") as HTMLElement);
        
      const rect = draw.rect(100, 100).fill("#00ff00");
      console.log("draw rect", rect);
      
    }
  }
}

export type {
  IMySVG
};

export { MySVG };
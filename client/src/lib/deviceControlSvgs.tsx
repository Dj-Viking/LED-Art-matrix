import React from "react";
import { calcPositionFromRange } from "../utils/calcPositionFromRange";

interface DeviceControlSvgProps {
  intensity_prop: number;
}

export const Fader: React.FC<DeviceControlSvgProps> = ({ intensity_prop }): JSX.Element => {

  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: `
        <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        
        <svg width="28" height="106" viewBox="0 0 28 106" fill="none" xmlns="http://www.w3.org/2000/svg">

          <rect x="11.5" y="0.5" width="5" height="105" stroke="white"/>

          <defs>
            <filter id="filter0_d_101_2" x="0" y="0" width="28" height="500" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix  in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset       dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite    in2="hardAlpha"  operator="out"/>
              <feColorMatrix  type="matrix"    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend        mode="normal"    in2="BackgroundImageFix" result="effect1_dropShadow_101_2"/>
              <feBlend        mode="normal"    in="SourceGraphic" in2="effect1_dropShadow_101_2" result="shape"/>
            </filter>
          </defs>

          <!-- both fader background and border and middle rect of fader -->
          <g filter="url(#filter0_d_101_2)">
            <rect x="4" y="${calcPositionFromRange(intensity_prop, 70, 1, 0, 127)}" width="20" height="37" rx="5" fill="black"/>
            <rect x="5" y="${calcPositionFromRange(intensity_prop, 70, 1, 0, 127)}" width="18" height="35" rx="4" stroke="white" stroke-width="2"/>
            <rect x="6" y="${calcPositionFromRange(intensity_prop, 70, 1, 0, 127)}" width="16" height="2" fill="white" transform="translate(0, 16)"/>          
          </g>

        </svg>


      `}}>
      </div>
    </>
  );
};

export const Knob: React.FC<DeviceControlSvgProps> = ({ intensity_prop }) => {

  /**
   * takes the input intensity number value into a string to translate and rotate the <rect> around the ellipse
   * referencing this @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#rotate
   * @param intensity_input midi intensity value
   */
  function translateKnobRect(intensity_input: number): string {

    const rotationPercentage = calcPositionFromRange(intensity_input, 0, 100, 0, 127);

    // somehow take the percentage and convert this into angle, x, y values for the rotation

    let angle = calcPositionFromRange(rotationPercentage, -140, 137, 0, 100);

    //so we can rotate along our own defined axis to follow the circle perimeter
    const vec2 = { x: 45, y: 62 };

    return `rotate(${angle}, ${vec2.x}, ${vec2.y})`;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: `

        <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        
        <svg width="91" height="106" viewBox="0 0 91 136" fill="none" xmlns="http://www.w3.org/2000/svg">
        
          <circle cx="45.5" cy="61.5" r="32.5" fill="white"/>

          <rect 
            x="45" 
            y="29" 
            width="4" 
            height="21" 
            transform="${translateKnobRect(intensity_prop)}"
            fill="black"
          />
          <rect x="44" width="4" height="16" fill="white"/>
          <rect x="3.75283" y="108.214" width="4" height="16" transform="rotate(-134.99 3.75283 108.214)" fill="white"/>
          <rect width="4" height="16" transform="matrix(0.731235 -0.682126 -0.682126 -0.731235 85.9912 109.357)" fill="white"/>

          <path d="M90.5 62C90.5 87.6967 70.3377 108.5 45.5 108.5C20.6623 108.5 0.5 87.6967 0.5 62C0.5 36.3033 20.6623 15.5 45.5 15.5C70.3377 15.5 90.5 36.3033 90.5 62Z" stroke="white"/>
          <path d="M72 95H23.5H17.5L3.5 110L16 135H74L86.5 111.5L81.5 105.5L72 95Z" fill="black" stroke="black"/>

        </svg>


      `}}>

      </div>
    </>
  );
};
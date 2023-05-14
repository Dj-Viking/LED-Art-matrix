import React, { useState } from "react";
import { keyGen } from "../utils/keyGen";

export const LedSVG: React.FC = () => {
    const [range, setRange] = useState(0);
    return (
        <>
            <div>
                <input
                    type="range"
                    min={0}
                    max={360}
                    value={range}
                    onInput={(e) => setRange(e.target.value)}
                />
                <span>{range}</span>
            </div>

            {new Array(16).fill(null).map((_, index) => {
                return (
                    <div style={{ height: 32 }} key={index}>
                        {(() => {
                            let elements = [];
                            const led_svg = (key: any): JSX.Element => (
                                <svg
                                    key={key}
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        width="32"
                                        height="32"
                                        rx="5"
                                        fill={`hsl(${range}, 100%, 50%)`}
                                    />
                                </svg>
                            );
                            for (let i = 0; i < 16; i++) {
                                elements.push(led_svg(`${i} - ${keyGen()}`));
                            }
                            return elements;
                        })()}
                    </div>
                );
            })}
        </>
    );
};

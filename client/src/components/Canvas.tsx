/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";

class LED {
    public h = 32;
    public w = 0;
    public x = 0;
    public y = 0;
    public fillStyle = "";

    public constructor(_x: number, _y: number, _w: number, _fillStyle: string) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.fillStyle = _fillStyle;
    }
}

export const Canvas: React.FC = () => {
    const led = new LED(1, 2, 3, ""); // will use in the future
    const { animVarCoeff } = getGlobalState(useSelector);
    const [isHSL, setIsHSL] = useState(true);
    const dispatch = useDispatch();

    // create reference to store the requestAnimationFrame ID when raf is called
    const RAFRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const countRef = useRef<number>(0);

    const INITIAL_WIDTH = window.innerWidth;

    // not ever setting state on this - don't want to re-render and stop the animations
    // resizing handles itself somehow
    const [dimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const createPaddedHexString = (hexString: string): string => {
        const num = parseInt(hexString, 16);
        return num <= 16 ? `0${hexString}` : hexString;
    };

    // initial setup for di
    useEffect(() => {
        if (canvasRef.current) {
            const currentCanvas = canvasRef.current;

            // when browser is zoomed at 80% this will let the whole LED matrix take the whole window
            currentCanvas.height = window.innerHeight + 200;
            currentCanvas.width = INITIAL_WIDTH;
        }
    }, [INITIAL_WIDTH]);

    const animate = useCallback(
        (time?: number): void => {
            if (time) {
                if (timeRef.current > 0) {
                    const deltaTime = time - timeRef.current;

                    // using count ref here because re-rendering with a setCount was stopping the animations!
                    countRef.current += deltaTime * 0.1 * Number(animVarCoeff);

                    const currentCanvas = canvasRef.current;
                    if (!currentCanvas) return;

                    const ctx = currentCanvas?.getContext("2d") as CanvasRenderingContext2D;

                    const radii = [4];
                    let fillStyle = "";
                    const h = 32;
                    // clear the canvas
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    for (let col = 0; col < LedStyleEngine.LED_AMOUNT + 1; col++) {
                        for (let row = 0; row < LedStyleEngine.LED_AMOUNT + 1; row++) {
                            let vx = 0;
                            let w = dimensions.width / 64;

                            if (dimensions.width === 1024) {
                                //

                                vx = Math.abs(col * 31 + (dimensions.width - 1024));
                                w = dimensions.width / 33;

                                //
                            } else if (dimensions.width > 1024) {
                                // move leds by column over by an X amount of window is larger than 1024 pixels
                                // to fill up the whole window

                                vx = col * 31 * (dimensions.width / 1024);
                                w = dimensions.width / 33;

                                //
                            } else if (dimensions.width <= 1024) {
                                //
                                vx = col * 31 * (dimensions.width / 1024);

                                // width offset when screen width is less than 1024
                                w = dimensions.width / w;
                                //
                            }
                            const vy = row * 30;

                            // // THIS IS THE SPIRAL PATTERN! add countRef to animate!
                            const num1 = row * 8 * col * Number(animVarCoeff) + countRef.current;

                            // // number that wraps around when overflowed so it can loop colors
                            const uint8_1 = new Uint8Array(1).fill(num1);

                            // const uint8_2 = new Uint8Array(1).fill(num2);

                            const intToHexString_1 = uint8_1[0].toString(16);

                            // let intToHexString_2 = uint8_2[0].toString(16);

                            const hslValue = parseInt(createPaddedHexString(intToHexString_1), 16);

                            const red = createPaddedHexString((50).toString(16));
                            const green = createPaddedHexString(intToHexString_1);
                            const blue = createPaddedHexString(intToHexString_1);

                            if (isHSL) {
                                fillStyle = `hsl(${hslValue}, 100%, 50%)`;
                            } else {
                                fillStyle = `#${red}${green}${blue}`;
                            }

                            ctx.fillStyle = fillStyle;
                            ctx.beginPath();
                            ctx.roundRect(vx, vy, w, h, radii);
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }

                RAFRef.current = window.requestAnimationFrame(animate);
            }
            if (time) {
                timeRef.current = time;
            }
            //
        },
        [dimensions.width, isHSL, animVarCoeff]
    );

    /**
     * @see https://css-tricks.com/using-requestanimationframe-with-react-hooks/
     */
    useEffect(() => {
        RAFRef.current = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(RAFRef.current);
    }, [animate]);

    window.addEventListener("DOMContentLoaded", (e) => {
        console.log("dom content loaded", e);
        animate();
    });

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ margin: "0 auto" }}>anim var{animVarCoeff}</div>
                <span>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={animVarCoeff}
                        onInput={(e) => {
                            dispatch(ledActions.setAnimVarCoeff(e.target.value));
                        }}
                    />
                    change me! {animVarCoeff}
                </span>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    height={dimensions.height}
                    width={dimensions.width}
                ></canvas>
            </div>
        </>
    );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";
import { CanvasLED } from "../utils/CanvasLED";

export const Canvas: React.FC = () => {
    const { animVarCoeff, presetName } = getGlobalState(useSelector);
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

                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    for (let col = 0; col < LedStyleEngine.LED_AMOUNT + 1; col++) {
                        for (let row = 0; row < LedStyleEngine.LED_AMOUNT + 1; row++) {
                            //
                            const led = new CanvasLED(
                                col,
                                row,
                                dimensions.width,
                                animVarCoeff,
                                countRef.current,
                                isHSL,
                                presetName
                            );

                            ctx.fillStyle = led.fillStyle;
                            ctx.beginPath();
                            ctx.roundRect(led.x, led.y, led.w, led.h, led.radii);
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
        [dimensions.width, isHSL, animVarCoeff, presetName]
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
                <button
                    style={{ color: "black", width: "50%", margin: "0 auto" }}
                    onClick={() => setIsHSL(!isHSL)}
                >
                    {isHSL ? "SWITCH TO HEX RGB" : "SWITCH TO HSL"}
                </button>
                <span style={{ margin: "0 auto" }}>{isHSL ? "HSL" : "HEX RGB"}</span>
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
                    style={{ marginTop: "40px" }}
                    id="canvas"
                    ref={canvasRef}
                    height={dimensions.height}
                    width={dimensions.width}
                ></canvas>
            </div>
        </>
    );
};

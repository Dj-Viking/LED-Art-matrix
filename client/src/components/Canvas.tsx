/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef } from "react";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { CanvasLED } from "../utils/CanvasLED";
import { ledActions } from "../store/ledSlice";
import { LED_AMOUNT } from "../constants";

export const Canvas: React.FC = () => {
    const { animVarCoeff, presetName, isHSL } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    // create reference to store the requestAnimationFrame ID when raf is called
    const RAFRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const countRef = useRef<number>(0);
    const ledRef = useRef<CanvasLED>({} as any);

    const INITIAL_WIDTH = window.innerWidth;

    // not ever setting state on this - don't want to re-render and stop the animations
    // resizing handles itself somehow
    const [dimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    // read only reference as an element when initialized to null
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

                    for (let col = 0; col < LED_AMOUNT + 1; col++) {
                        for (let row = 0; row < LED_AMOUNT + 1; row++) {
                            ledRef.current = new CanvasLED(
                                col,
                                row,
                                dimensions.width,
                                animVarCoeff,
                                countRef.current,
                                isHSL,
                                presetName
                            );

                            ctx.fillStyle = ledRef.current.fillStyle;
                            ctx.beginPath();
                            ctx.roundRect(
                                ledRef.current.x,
                                ledRef.current.y,
                                ledRef.current.w,
                                ledRef.current.h,
                                ledRef.current.radii
                            );
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
        animate();
        RAFRef.current = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(RAFRef.current);
    }, [animate]);

    const resetCountRef = useCallback((): void => {
        countRef.current = 0;
    }, []);

    useEffect(() => {
        dispatch(ledActions.setResetTimerFn(resetCountRef));
    }, [dispatch, resetCountRef]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
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

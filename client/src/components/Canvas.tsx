/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef } from "react";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { CanvasLED } from "../utils/CanvasLED";
import { ledActions } from "../store/ledSlice";
import { LED_AMOUNT } from "../constants";

export const Canvas: React.FC = () => {
    const { animVarCoeff, presetName, isHSL, samplesLength, analyserNodeRef } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    // create reference to store the requestAnimationFrame ID when raf is called
    const RAFRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const countRef = useRef<number>(0);
    const ledRef = useRef<CanvasLED>({} as any);
    const samplesRef = useRef<Float32Array>(new Float32Array(0));

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
        if (samplesLength > 0 && samplesRef.current.length === 0) {
            samplesRef.current = new Float32Array(samplesLength);
        }
    }, [samplesLength]);

    useEffect(() => {
        if (canvasRef.current) {
            const currentCanvas = canvasRef.current;

            // when browser is zoomed at 80% this will let the whole LED matrix take the whole window
            currentCanvas.height = window.innerHeight + 200;
            currentCanvas.width = INITIAL_WIDTH;
        }
    }, [INITIAL_WIDTH]);

    const createHSLStyleFromSamplesAndCoords = (
        x: number, 
        y: number, 
        sample: number,
        sample_index: number,
    ): string => {
        void(x);
        void(y);

        let changeme = 360;
        let something = sample + (changeme) * (sample_index || 1);
        let wheel = something;
        let fillstyle = `hsl(${wheel}, 100%, 50%)`;
        
        return fillstyle;
    };

    const animate = useCallback(
        (time?: number): void => {
            if (time) {
                if (timeRef.current > 0) {
                    const deltaTime = time - timeRef.current;
                    // console.log("samples", samples);

                    // using count ref here because re-rendering with a setCount was stopping the animations!
                    countRef.current += deltaTime * 0.1 * Number(animVarCoeff);

                    const currentCanvas = canvasRef.current;
                    if (!currentCanvas) return;

                    // update the sample fft data ref array thing on each frame of animation
                    if (analyserNodeRef.current instanceof AnalyserNode) {
                        analyserNodeRef.current.getFloatFrequencyData(samplesRef.current);
                    }

                    const ctx = currentCanvas?.getContext("2d") as CanvasRenderingContext2D;

                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    // initialize another variable to count the index of the samples float32[]
                    let samples_index = 0;
                    for (let col = 0; col < LED_AMOUNT + 1; col++) {
                        
                        // weird hack to make sure we're in bounds for the samples array
                        // but also staying in bounds after iterating through the rows.
                        if (col === 0) {
                            samples_index = 0;
                        } else {

                            // we reached the end of the array so now we just 
                            // decrement enough to get the last item before coming back through 
                            // here again to get the last fill style for the last "LED" rect on the canvas
                            if (samples_index === samplesLength) {
                                samples_index--;
                            }
                        } 

                        for (let row = 0; row < LED_AMOUNT + 1; row++) {

                            ledRef.current = new CanvasLED(
                                col,
                                row,
                                dimensions.width,
                                animVarCoeff,
                                countRef.current,
                                isHSL,
                                presetName,
                            );

                            if (samplesLength > 0) {
                                // set fill style here with samples
                                // and not use the led logic to generate the fillstyle;
                                let sample = 0;
                                if (samplesRef.current.some(() => true)) {
                                    // @ts-ignore fix compiler lib option maybe?? saying float32array doesn't have .at() method..... es2022 
                                    sample = samplesRef.current.at(samples_index);
                                }
                                ctx.fillStyle = createHSLStyleFromSamplesAndCoords(col, row, sample, samples_index);
                            } else {
                                ctx.fillStyle = ledRef.current.fillStyle;
                            }

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
                                
                            // done drawing this sample move to next sample
                            samples_index++;
                        }
                        // offset the count because of the weird LED col row calculation 
                        // so we can stay in bounds of the samples array
                        samples_index -= 1;
                    }
                }

                RAFRef.current = window.requestAnimationFrame(animate);
            }
            if (time) {
                timeRef.current = time;
            }
            //
        },
        [dimensions.width, isHSL, animVarCoeff, presetName, samplesLength, analyserNodeRef]
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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { getGlobalState } from "../store/store";
import { useSelector } from "react-redux";

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
    const { animVarCoeff } = getGlobalState(useSelector);
    const [range, setRange] = useState<any>(0);
    const [isHSL, setIsHSL] = useState(true);

    const INITIAL_WIDTH = window.innerWidth;

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const createPaddedHexString = (hexString: string): string => {
        const num = parseInt(hexString, 16);
        return num <= 16 ? `0${hexString}` : hexString;
    };

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D, time?: number) => {
            if (time) {
                console.log("drawing with time", time);
            }

            const radii = [4];
            let fillStyle = "";
            const h = 32;

            // draw leds on canvas
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
                        vx = Math.abs(col * 16);

                        // width offset when screen width is less than 1024
                        w = dimensions.width / w;
                        //
                    }
                    const vy = row * 30;

                    // THIS IS THE SPIRAL PATTERN!
                    const num1 = row * 8 * col * Number(animVarCoeff);
                    // const num1 = j * 16 * (i * 16 - Number(animVarCoeff));
                    // const num2 = j * 16 * (i * 16 - Number(animVarCoeff));

                    // number that wraps around when overflowed so it can loop colors
                    const uint8_1 = new Uint8Array(1).fill(num1);

                    // const uint8_2 = new Uint8Array(1).fill(num2);

                    const intToHexString_1 = uint8_1[0].toString(16);

                    // let intToHexString_2 = uint8_2[0].toString(16);

                    const hslValue = parseInt(createPaddedHexString(intToHexString_1), 16);
                    setRange(hslValue);

                    const red = createPaddedHexString((50).toString(16));
                    const green = createPaddedHexString(intToHexString_1);
                    const blue = createPaddedHexString(intToHexString_1);

                    // console.log(fillStyle);
                    if (isHSL) {
                        fillStyle = `hsl(${hslValue}, 100%, 50%)`;
                    } else {
                        fillStyle = `#${red}${green}${blue}`;
                    }

                    ctx.fillStyle = fillStyle;
                    ctx.beginPath();
                    ctx.roundRect(vx, vy, w, h, radii);
                    ctx.fill();
                }
            }
            //
        },
        [dimensions.width, animVarCoeff, isHSL]
    );

    // SETUP
    const resizeHandler = useCallback(
        (e: { target: typeof window }): void => {
            const currentCanvas = canvasRef.current;

            const newWidth = e.target.innerWidth;
            const newHeight = e.target.innerHeight;

            setDimensions({
                height: newHeight,
                width: newWidth,
            });

            if (currentCanvas) {
                const ctx = currentCanvas.getContext("2d") as CanvasRenderingContext2D;
                draw(ctx);
            }
        },
        [draw]
    );

    const animate = useCallback(
        (time: DOMHighResTimeStamp | number): void => {
            console.log(Date.now(), "\n", "animating", time);

            const currentCanvas = canvasRef.current;
            if (currentCanvas) {
                // const ctx = currentCanvas.getContext("2d") as CanvasRenderingContext2D;
                // lagging like shit here
                // ctx.save();
                // draw(ctx, time);
            }

            window.requestAnimationFrame(animate);
        },
        [draw]
    );

    // initial setup and draw first render
    useEffect(() => {
        //@ts-ignore
        window.addEventListener("resize", resizeHandler);

        if (canvasRef.current) {
            const currentCanvas = canvasRef.current;
            const ctx = currentCanvas.getContext("2d") as CanvasRenderingContext2D;

            currentCanvas.height = window.innerHeight - 2;
            currentCanvas.width = INITIAL_WIDTH;

            draw(ctx);
        }

        return () => {
            // @ts-ignore
            window.removeEventListener("resize", resizeHandler);
        };
    }, [resizeHandler, INITIAL_WIDTH, draw]);

    // window.addEventListener("DOMContentLoaded", () => {
    //     animate(0);
    // });

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ margin: "0 auto" }}>anim var{animVarCoeff}</div>
                <div style={{ margin: "0 auto" }}>range {range}</div>
                <canvas
                    ref={canvasRef}
                    height={dimensions.height}
                    width={dimensions.width}
                ></canvas>
            </div>
        </>
    );
};

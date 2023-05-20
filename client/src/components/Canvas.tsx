import React, { useCallback, useEffect, useRef } from "react";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";

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
    const INITIAL_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT_OFFSET = 153.5124969482422;

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight - CANVAS_HEIGHT_OFFSET,
        width: window.innerWidth,
    });

    // const [];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const createPaddedHexString = (hexString: string): string => {
        return parseInt(hexString, 16) <= 16 ? `0${hexString}` : hexString;
    };

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const radii = [4];
            let fillStyle = "";

            // draw leds on canvas
            for (let i = 0; i < LedStyleEngine.LED_AMOUNT; i++) {
                for (let j = 0; j < LedStyleEngine.LED_AMOUNT; j++) {
                    let vx = 0;
                    let w = dimensions.width / 32;

                    if (dimensions.width === 1024) {
                        vx = Math.abs(i * 32 + (dimensions.width - 1024));
                    } else if (dimensions.width > 1024) {
                        // move leds by column over by an X amount of window is larger than 1024 pixels
                        // to fill up the whole window
                        vx = i * 32 * (dimensions.width / 1024);
                    } else if (dimensions.width <= 1024) {
                        vx = Math.abs(i * 32);
                        // width offset when screen width is less than 1024
                        w = dimensions.width / w;
                    }
                    // console.log("i", i, "vx", vx);
                    const vy = j * 32;
                    const h = 32;
                    const intToHexString = (j * 16).toString(16);
                    fillStyle = `#00FF${createPaddedHexString(intToHexString)}`;
                    // fillStyle = "white";
                    ctx.fillStyle = fillStyle;
                    ctx.strokeStyle = "black";
                    ctx.beginPath();
                    ctx.roundRect(vx, vy, w, h, radii);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            //
        },
        [dimensions.width]
    );

    // SETUP
    const resizeHandler = useCallback(
        (e: { target: typeof window }): void => {
            const currentCanvas = canvasRef.current;

            const newWidth = e.target.innerWidth;
            const newHeight = e.target.innerHeight - CANVAS_HEIGHT_OFFSET;

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

    // initial setup and draw first render
    useEffect(() => {
        //@ts-ignore
        window.addEventListener("resize", resizeHandler);

        if (canvasRef.current) {
            const currentCanvas = canvasRef.current;
            const ctx = currentCanvas.getContext("2d") as CanvasRenderingContext2D;

            currentCanvas.height = window.innerHeight - 3;
            currentCanvas.width = INITIAL_WIDTH;

            draw(ctx);
        }

        return () => {
            // @ts-ignore
            window.removeEventListener("resize", resizeHandler);
        };
    }, [resizeHandler, INITIAL_WIDTH, draw]);
    return (
        <>
            <canvas ref={canvasRef} height={dimensions.height} width={dimensions.width}></canvas>
        </>
    );
};

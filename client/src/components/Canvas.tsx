import React, { useCallback, useEffect, useRef } from "react";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";

export const Canvas: React.FC = () => {
    const INITIAL_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT_OFFSET = 153.5124969482422;

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight - CANVAS_HEIGHT_OFFSET,
        width: window.innerWidth,
    });

    // const [];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const radii = [4];

            ctx.beginPath();
            // draw leds on canvas
            for (let i = 0; i < LedStyleEngine.LED_AMOUNT; i++) {
                for (let j = 0; j < LedStyleEngine.LED_AMOUNT; j++) {
                    let vx = 0;
                    // TODO(maybe): adjust width of rects to stay close together and not get too thin when screen width is smaller
                    let w = dimensions.width / 32;

                    if (dimensions.width === 1024) {
                        vx = Math.abs(i * 32 + (dimensions.width - 1024));
                    } else if (dimensions.width > 1024) {
                        // move leds by column over by an X amount of window is larger than 1024 pixels
                        // to fill up the whole window
                        vx = i * 32 * (dimensions.width / 1024);
                    } else if (dimensions.width <= 1024) {
                        vx = Math.abs(i * 32);
                    }
                    console.log("i", i, "vx", vx);

                    const vy = j * 32;
                    const h = 32;

                    ctx.roundRect(vx, vy, w, h, radii);
                }
            }
            ctx.fillStyle = "#00FF00";
            ctx.fill();
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

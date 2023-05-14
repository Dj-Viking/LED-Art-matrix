import React, { useCallback, useEffect, useRef } from "react";

export const Canvas: React.FC = () => {
    const INITIAL_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT_OFFSET = 153.5124969482422;

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight - CANVAS_HEIGHT_OFFSET,
        width: window.innerWidth,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.fillStyle = "red";
        ctx.fill();
    }, []);

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

    useEffect(() => {
        //@ts-ignore
        window.addEventListener("resize", resizeHandler);

        if (canvasRef.current) {
            const currentCanvas = canvasRef.current;
            const ctx = currentCanvas.getContext("2d") as CanvasRenderingContext2D;

            const currentLocation = currentCanvas.getBoundingClientRect().top;

            currentCanvas.height = window.innerHeight - currentLocation;
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

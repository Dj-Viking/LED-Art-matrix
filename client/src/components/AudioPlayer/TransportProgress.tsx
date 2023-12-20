/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { calcPositionFromRange } from "../../utils/calcPositionFromRange";

export interface TransportProgressProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const TransportProgress: React.FC<TransportProgressProps> = (props) => {
    const { audioRef } = props;

    const RAFRef = React.useRef<number>(0);
    const mouseIsDown = React.useRef<boolean>(false);
    const transportRefForDrag = React.useRef<number>(0);
    const [time, setTime] = React.useState<number>(0);

    const handleTimeUpdate = React.useCallback((event: Event) => {
        if (!mouseIsDown.current) {
            setTime(event.target!.currentTime);
        }
    }, []);

    const animate = React.useCallback(
        (_rafTime?: number): void => {
            if (audioRef.current) {
                // re-render at the speed of the screen's refresh rate
                if (!mouseIsDown.current) {
                    setTime(audioRef.current!.currentTime);
                }
            }
            RAFRef.current = window.requestAnimationFrame(animate);
        },
        [audioRef]
    );

    // TODO: handle drag events across progress??
    const handleMouseDrag = React.useCallback(
        (e: React.MouseEvent<HTMLProgressElement>) => {
            if (mouseIsDown.current) {
                const target = e.target as HTMLProgressElement;
                const rect = target.getBoundingClientRect();
                const transportPosition = calcPositionFromRange(
                    e.clientX,
                    0,
                    audioRef.current!.duration,
                    rect.x,
                    rect.x + rect.width
                );
                transportRefForDrag.current = transportPosition;
                setTime(transportPosition);
            }
        },
        [audioRef]
    );

    const handleClickTransport = React.useCallback(
        (event: React.MouseEvent<HTMLProgressElement>) => {
            const target = event.target as HTMLProgressElement;

            const rect = target.getBoundingClientRect();

            // rect x position is 130, and rect width is 160
            // so mouse event client X position along the progress rect clicked will produce
            // what current time to set the currently playing audio track

            const transportPosition = calcPositionFromRange(
                event.clientX,
                0,
                audioRef.current!.duration,
                rect.x,
                rect.x + rect.width
            );

            audioRef.current!.currentTime = transportPosition;
        },
        [audioRef]
    );

    function convertTime(secs: number): string {
        const date = new Date(0);
        date.setSeconds(secs);
        const timeString = date.toISOString().substring(11, 19);
        return timeString;
    }

    React.useEffect(() => {
        // animate();
        RAFRef.current = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(RAFRef.current);
    }, [animate]);

    React.useEffect(() => {
        let ref: React.RefObject<HTMLAudioElement>;
        if (audioRef.current) {
            ref = audioRef;
            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
        }

        return () => {
            ref.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [handleTimeUpdate, audioRef]);

    /**
     * TODO:
     * create own element that can be dragged to aesthetically show a circle that glides across
     * the transport progress bar as time elapses and can be moved with clicking and dragging
     */
    return (
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", width: "100%" }}>
            <progress
                style={{ cursor: "pointer", width: "79%" }}
                onClick={handleClickTransport}
                onMouseDown={() => {
                    mouseIsDown.current = true;
                }}
                onMouseMove={handleMouseDrag}
                onMouseUp={() => {
                    mouseIsDown.current = false;
                    audioRef.current!.currentTime = transportRefForDrag.current;
                }}
                max={audioRef.current?.duration || 0}
                value={time || 0}
            />
            {audioRef.current?.currentTime ? (
                <span>
                    {convertTime(time)} -- {convertTime(audioRef.current?.duration)}
                </span>
            ) : (
                <span style={{ visibility: "visible" }}>00:00:00 -- 00:00:00</span>
            )}
        </div>
    );
};

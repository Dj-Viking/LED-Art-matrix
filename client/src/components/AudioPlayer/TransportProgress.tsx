/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { calcPositionFromRange } from "../../utils/calcPositionFromRange";

export interface TransportProgressProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const TransportProgress: React.FC<TransportProgressProps> = (props) => {
    const { audioRef } = props;

    const RAFRef = React.useRef<number>(0);
    const progressRef = React.useRef<HTMLProgressElement>(null);
    const clientXRef = React.useRef<number>(0);
    const rectRef = React.useRef<DOMRect>({} as any);
    const mouseIsDown = React.useRef<boolean>(false);
    const transportRefForDrag = React.useRef<number>(0);
    const [time, setTime] = React.useState<number>(0);

    React.useEffect(() => {
        if (progressRef.current) {
            rectRef.current = progressRef.current.getBoundingClientRect();
            clientXRef.current = progressRef.current.offsetLeft;
        }
    }, []);

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

    const handleMouseDrag = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (mouseIsDown.current) {
                const target = e.target as HTMLElement;

                const rect = target.getBoundingClientRect();
                rectRef.current = rect;
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
        (event: React.MouseEvent<HTMLElement>) => {
            const target = event.target as HTMLElement;

            const rect = target.getBoundingClientRect();
            rectRef.current = rect;
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

    const onMouseUp = React.useCallback(
        (_) => {
            mouseIsDown.current = false;
            audioRef.current!.currentTime = transportRefForDrag.current;
        },
        [audioRef]
    );

    const onMouseDown = React.useCallback((_) => {
        mouseIsDown.current = true;
    }, []);

    function convertTime(secs: number): string {
        const date = new Date(0);
        date.setSeconds(secs);
        const timeString = date.toISOString().substring(11, 19);
        return timeString;
    }

    React.useEffect(() => {
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

    return (
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", width: "60%" }}>
            <div style={{ position: "relative" }}>
                <input
                    className="myrangestyle"
                    onChange={() => {
                        return null;
                    }}
                    onClick={handleClickTransport}
                    onMouseDown={onMouseDown}
                    onMouseMove={handleMouseDrag}
                    onMouseUp={onMouseUp}
                    type="range"
                    min="0"
                    step=".001"
                    value={time || 0}
                    max={audioRef.current?.duration || 0}
                />
            </div>
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

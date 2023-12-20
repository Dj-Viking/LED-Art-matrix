/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { calcPositionFromRange } from "../../utils/calcPositionFromRange";

export interface TransportProgressProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const TransportProgress: React.FC<TransportProgressProps> = (props) => {
    const { audioRef } = props;

    const RAFRef = React.useRef<number>(0);
    const [, setTime] = React.useState<number>(0);

    const handleTimeUpdate = React.useCallback((event: Event) => {
        setTime(event.target!.currentTime);
    }, []);

    const animate = React.useCallback(
        (_rafTime?: number): void => {
            if (audioRef.current) {
                // re-render at the speed of the screen's refresh rate
                setTime(audioRef.current!.currentTime);
            }
            RAFRef.current = window.requestAnimationFrame(animate);
        },
        [audioRef]
    );

    // TODO: handle drag events across progress??
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

    return (
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", width: "100%" }}>
            <progress
                style={{ cursor: "pointer", width: "79%" }}
                onClick={handleClickTransport}
                max={audioRef.current?.duration || 0}
                value={audioRef.current?.currentTime || 0}
            />
            {audioRef.current?.currentTime ? (
                <span>
                    {convertTime(audioRef.current?.currentTime)} -- {convertTime(audioRef.current?.duration)}
                </span>
            ) : (
                <span style={{ visibility: "visible" }}>00:00:00 -- 00:00:00</span>
            )}
        </div>
    );
};

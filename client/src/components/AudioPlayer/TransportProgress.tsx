/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";

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

    function convertDurationTime(secs: number): string {
        return (Number(secs) / 60).toString().substring(0, 5).replace(".", ":");
    }

    function convertElapsedTime(secs: number): string {
        let newTime = secs
            .toString()
            .substring(secs.toString().split("").indexOf(".") - 3, 7)
            .replace(".", ":");

        return newTime;
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
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px" }}>
            <progress max={audioRef.current?.duration || 0} value={audioRef.current?.currentTime || 0} />
            {audioRef.current?.currentTime ? (
                <span>
                    {convertElapsedTime(audioRef.current?.currentTime)} --{" "}
                    {convertDurationTime(audioRef.current?.duration)}
                </span>
            ) : (
                <span style={{ visibility: "visible" }}>00:00:00 -- 00:00:00</span>
            )}
        </div>
    );
};

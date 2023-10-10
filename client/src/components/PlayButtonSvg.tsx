import React, { useEffect } from "react";
import styled from "styled-components";
import { Track } from "./AudioPlayer";
const StyledSvg = styled.div`
    & {
        display: flex;
        justify-content: center;
    }
`;
export interface SvgPlayButtonProps {
    height: number;
    currentTrack: Track;
    width: number;
    fill: "black" | "white" | "green";
    style?: React.CSSProperties;
    audioRef: React.RefObject<HTMLAudioElement>;
}
export const PlayButtonSvg: React.FC<SvgPlayButtonProps> = (props) => {
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const { audioRef, height, width, style, fill, currentTrack } = props;

    const clickHandler = React.useCallback(() => {
        console.log("clicked handler!!!");
        if (audioRef.current) {
            (async () => {
                if (!isPlaying) {
                    setIsPlaying(true);
                    console.log("what is current track here", currentTrack);
                    await audioRef.current?.play();
                } else {
                    console.log("what is current track here", currentTrack);
                    setIsPlaying(false);
                    audioRef.current?.pause();
                }
            })();
        }
    }, [audioRef, isPlaying, currentTrack]);

    useEffect(() => {
        //
        (async () => {
            if (audioRef.current) {
                if (!isPlaying) {
                    // setIsPlaying(true);
                    // await audioRef.current?.play?.();       
                } else {
                    // setIsPlaying(false);
                    // await audioRef.current?.play?.();
                }
            }
        })();
        return () => void 0;
    }, [currentTrack, isPlaying, audioRef]);

    return (
        <>
            {!isPlaying ? (
                <StyledSvg
                    onClick={clickHandler}
                    style={style}
                    dangerouslySetInnerHTML={{
                        __html: `
                         <svg xmlns="http://www.w3.org/2000/svg"
                              focusable="false" 
                              width="${height}" 
                              height="${width}" 
                              preserveAspectRatio="xMidYMid meet" 
                              viewBox="0 0 24 24" 
                              style="transform: rotate(360deg);cursor: pointer;"
                         >     
                            <path 
                                d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2z" 
                                fill="${fill}"
                            ></path>
                         </svg>    
    
                    `,
                    }}
                />
            ) : (
                <StyledSvg
                    onClick={clickHandler}
                    dangerouslySetInnerHTML={{
                        __html: `
                    
                    <h1> CLICK ME TO PAUSE (TODO MAKE A PAUSE BUTTON SVG)</h1>
                `,
                    }}
                />
            )}
        </>
    );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import styled from "styled-components";
import { PlayPauseButtonControlProps } from "./AudioPlayer.style";
const StyledSvg = styled.div`
    & {
        display: flex;
        justify-content: center;
    }
`;
export const PlayButtonSvg: React.FC<PlayPauseButtonControlProps> = (props) => {
    const { audioRef, setIsPlaying, isPlaying, height, width, fill } = props;
    const clickHandler = React.useCallback(() => {
        if (audioRef.current) {
            (async () => {
                if (!isPlaying) {
                    setIsPlaying(true);
                    await audioRef.current!.play();
                } else {
                    setIsPlaying(false);
                    audioRef.current!.pause();
                }
            })();
        }
    }, [audioRef, isPlaying, setIsPlaying]);

    return (
        <StyledSvg
            onClick={clickHandler}
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
    );
};

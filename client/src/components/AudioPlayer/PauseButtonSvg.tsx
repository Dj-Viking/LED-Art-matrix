/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import styled from "styled-components";
import { PauseButtonFill, PlayPauseButtonControlProps } from "./AudioPlayer.style";
const StyledSvg = styled.div`
    & {
        display: flex;
        height: 83.33px;
        width: 83.33px;
        margin: 0 auto 17px auto;
        justify-content: center;
    }
`;

export const PauseButtonSvg: React.FC<PlayPauseButtonControlProps> = (props) => {
    const { fill: _fill, isPlaying, setIsPlaying, audioRef, height, width } = props;
    const fill = _fill as PauseButtonFill;

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
            
            <svg
                width="${width}" 
                height="${height}" 
                viewBox="0 0 55 53" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style="cursor: pointer;"
            >
                <ellipse cx="27.5" cy="26.5" rx="27.5" ry="26.5" fill="${fill.button}"/>
                <rect x="14" y="10" width="9" height="32" rx="0" fill="${fill.pauseBars}"/>
                <rect x="32" y="10" width="9" height="32" rx="0" fill="${fill.pauseBars}"/>
            </svg>
        
        `,
            }}
        ></StyledSvg>
    );
};

import React, { useEffect } from "react";
import styled from "styled-components";
const StyledSvg = styled.div`
    & {
        position: absolute;
        color: ${(props) => (props.ref !== null ? "white" : "black")};
    }
`;
export interface SvgPlayButtonProps {
    [key: string]: any;
    height: number;
    width: number;
    fill: "black" | "white" | "green";
}
export const PlayButtonSvg: React.FC<SvgPlayButtonProps> = (props) => {
    useEffect(() => {
        console.log("mounted svg player button!!!!", props);
        return () => console.log("unmounted play button");
    });
    return (
        <>
            <StyledSvg
                dangerouslySetInnerHTML={{
                    __html: `
                     <svg xmlns="http://www.w3.org/2000/svg" 
                          focusable="false" 
                          width="${props.height}" 
                          height="${props.width}" 
                          preserveAspectRatio="xMidYMid meet" 
                          viewBox="0 0 24 24" 
                          style="transform: rotate(360deg);"
                     >     
                        <path 
                            d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2z" 
                            fill="${props.fill}"
                        ></path>
                     </svg>    

                `,
                }}
            />
        </>
    );
};

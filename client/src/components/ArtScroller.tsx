import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import "./aux-styles/artScrollerLayoutStyle.css";
import { getRandomIntLimit } from "../utils/helpers";
import { setAnimDuration, setHPos, setInvert, setVertPos } from "../actions/art-scroller-actions";
import { MyRootState } from "../types";
import {
    ArtScrollerBorderTop,
    ArtScrollerCircleWidthLabel,
    ArtScrollerCircleWidthSlider,
    ArtScrollerGifButtonContainer,
    ArtScrollerHorizontalPositionSlider,
    ArtScrollerHorizontalPositionSliderLabel,
    ArtScrollerMainContainer,
    ArtScrollerSection,
    ArtScrollerSliderContainer,
    ArtScrollerStartButton,
    ArtScrollerTitle,
    ArtScrollerToggleButton,
    ArtScrollerVerticalPositionSlider,
    ArtScrollerVerticalPositionSliderLabel,
    InvertColorsSliderLabel,
} from "./ArtScroller.style";

const ArtScroller: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const { gifs, animDuration, vertPos, hPos, circleWidth, invert, figureOn } = useSelector(
        (state: MyRootState) => state.artScrollerState
    );

    return (
        <>
            <ArtScrollerMainContainer>
                <ArtScrollerSection>
                    <ArtScrollerBorderTop />
                    <ArtScrollerTitle />
                    <ArtScrollerGifButtonContainer>
                        <ArtScrollerStartButton />
                        <ArtScrollerToggleButton />
                    </ArtScrollerGifButtonContainer>
                    <ArtScrollerSliderContainer>
                        <ArtScrollerCircleWidthLabel />
                        <ArtScrollerCircleWidthSlider />
                        <ArtScrollerVerticalPositionSliderLabel />
                        <ArtScrollerVerticalPositionSlider />
                        <ArtScrollerHorizontalPositionSliderLabel />
                        <ArtScrollerHorizontalPositionSlider />
                        <InvertColorsSliderLabel />
                        <input
                            className="slider-style"
                            name="invert"
                            type="range"
                            data-testid="invert"
                            min="0"
                            max="100"
                            value={invert}
                            onChange={(event) => {
                                event.preventDefault();
                                dispatch(setInvert(event.target.value));
                            }}
                        />
                        <label htmlFor="animation-duration" style={{ color: "white" }}>
                            Scroll Speed: {Number(animDuration) / 100}
                        </label>
                        <input
                            className="slider-style"
                            name="animation-duration"
                            type="range"
                            data-testid="anim-duration"
                            min="1"
                            max="100"
                            value={animDuration}
                            onChange={(event) => {
                                event.preventDefault();
                                dispatch(setAnimDuration(event.target.value));
                            }}
                        />
                    </ArtScrollerSliderContainer>
                    <figure
                        data-testid="gifs-container"
                        style={{
                            display: `${figureOn ? "block" : "none"}`,
                            margin: "0",
                        }}
                        className="figure-transition-style"
                    >
                        {Array.isArray(gifs) &&
                            gifs.map((gif, index) => (
                                <img
                                    key={gif._id}
                                    data-testid={`gif-${index}`}
                                    id={`gif-${index}`}
                                    alt={`gif-${index}`}
                                    src={gif.gifSrc as string}
                                    style={{
                                        position: "absolute",
                                        // satisfies type export type ZIndex = Globals | "auto" | (number & {});
                                        zIndex: 1,
                                        filter: `invert(${Number(invert) / 100})`,
                                        borderRadius: "50%",
                                        animationName: "scrollAnim",
                                        animationDuration: `${
                                            (Number(animDuration) / 100) *
                                            (index + getRandomIntLimit(index, 20))
                                        }s`,
                                        animationDelay: `0.${index + 1}`,
                                        animationTimingFunction: "ease-in",
                                        animationDirection: "reverse",
                                        animationIterationCount: "infinite",
                                        top: `${vertPos}vh`,
                                        width: `${circleWidth}vw`,
                                        left: `${hPos}vw`,
                                    }}
                                    className="scroller-media"
                                />
                            ))}
                    </figure>
                </ArtScrollerSection>
            </ArtScrollerMainContainer>
        </>
    );
};

export default ArtScroller;

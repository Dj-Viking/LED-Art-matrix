import React, { DOMAttributes } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { _leftInitButtonSpring, _scrollerOnOffButtonSpring } from "./SpringButtons";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalState } from "../reducers";
import API from "../utils/ApiService";
import {
    setGifs,
    setFigureOn,
    setCircleWidth,
    setVertPos,
    setHPos,
    setInvert,
    setAnimDuration,
} from "../actions/art-scroller-actions";
import "./aux-styles/artScrollerLayoutStyle.css";
import { BKeySvg } from "../lib/keySvgs";
import { IGif } from "../types";
import { getRandomIntLimit } from "../utils/helpers";
const ArtScrollerMainContainer = styled.main`
    display: flex;
    flex-direction: column;
`;

const ArtScrollerSection: React.FC = ({ children }) => {
    return <section>{children}</section>;
};

const ArtScrollerBorderTop: React.FC = () => {
    return <div className="border-top-artScroller" />;
};

const ArtScrollerTitle: React.FC = () => {
    return (
        <span
            style={{
                color: "white",
                textAlign: "center",
            }}
        >
            Art Scroller Controls
        </span>
    );
};

const ArtScrollerGifButtonContainer: React.FC = ({ children }) => {
    return <div className="gif-button-container">{children}</div>;
};

type ArtScrollerStartButtonProps = DOMAttributes<HTMLButtonElement>;

const ArtScrollerStartButton: React.FC<ArtScrollerStartButtonProps> = () => {
    const leftInitButtonSpring = useSpring(_leftInitButtonSpring);
    const dispatch = useDispatch();
    const { figureOn } = getGlobalState(useSelector);
    async function handleGetGifs(event: any): Promise<void> {
        event.persist();
        if (figureOn === false) dispatch(setFigureOn(true));
        const gifs = await API.getGifs();
        if (Array.isArray(gifs)) {
            if (gifs.length) {
                dispatch(setGifs(gifs));
            }
        }
    }
    return (
        <animated.button
            style={leftInitButtonSpring}
            role="button"
            data-testid="start-art"
            className="scroller-fetch-button"
            onClick={handleGetGifs}
        >
            Start Art Scroller!
        </animated.button>
    );
};

type ArtScrollerToggleButtonProps = DOMAttributes<HTMLButtonElement>;

const ArtScrollerToggleButton: React.FC<ArtScrollerStartButtonProps> = () => {
    const scrollerOnOffButtonSpring = useSpring(_scrollerOnOffButtonSpring);
    const dispatch = useDispatch();
    const { figureOn } = getGlobalState(useSelector);
    return (
        <animated.button
            role="button"
            data-testid="switch-scroller"
            style={scrollerOnOffButtonSpring}
            className={figureOn ? "scroller-toggle-button-on" : "scroller-toggle-button-off"}
            onClick={(event: any) => {
                event.preventDefault();
                dispatch(setFigureOn(!figureOn));
            }}
        >
            {figureOn ? (
                <>
                    <BKeySvg />
                    <span style={{ color: "white" }}>Turn Off Scroller</span>
                </>
            ) : (
                <>
                    <BKeySvg />
                    <span style={{ color: "white" }}>Turn On Scroller</span>
                </>
            )}
        </animated.button>
    );
};

const ArtScrollerSliderContainer: React.FC = ({ children }) => {
    return <div className="slider-container">{children}</div>;
};

const ArtScrollerCircleWidthLabel: React.FC = () => {
    const { circleWidth } = getGlobalState(useSelector);
    return (
        <label htmlFor="scroller-circle-width" style={{ color: "white" }}>
            Scroller Circle Width: {circleWidth}
        </label>
    );
};

type ArtScrollerCircleWidthSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerCircleWidthSlider: React.FC<ArtScrollerCircleWidthSliderProps> = () => {
    const { circleWidth } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <input
            name="scroller-circle-width"
            className="slider-style"
            type="range"
            data-testid="circle-width"
            min="0"
            max="100"
            value={circleWidth}
            onChange={(event) => {
                event.preventDefault();
                dispatch(setCircleWidth(event.target.value));
            }}
        />
    );
};

const ArtScrollerVerticalPositionSliderLabel: React.FC = () => {
    const { vertPos } = getGlobalState(useSelector);
    return (
        <label htmlFor="vertical-positioning" style={{ color: "white" }}>
            Scroller Vert Positioning: {vertPos}
        </label>
    );
};
type ArtScrollerVerticalPositionSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerVerticalPositionSlider: React.FC<ArtScrollerVerticalPositionSliderProps> = () => {
    const { vertPos } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <input
            name="vertical-positioning"
            className="slider-style"
            data-testid="vert-pos"
            type="range"
            min="0"
            max="200"
            value={vertPos}
            onChange={(event) => {
                event.preventDefault();
                dispatch(setVertPos(event.target.value));
            }}
        />
    );
};

const ArtScrollerHorizontalPositionSliderLabel: React.FC = () => {
    const { hPos } = getGlobalState(useSelector);
    return (
        <label htmlFor="horizontal-positioning" style={{ color: "white" }}>
            Scroller Horizontal Positioning: {Number(hPos) / 1000}
        </label>
    );
};

type ArtScrollerHorizontalPositionSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerHorizontalPositionSlider: React.FC<
    ArtScrollerHorizontalPositionSliderProps
> = () => {
    const { hPos } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <input
            name="horizontal-positioning"
            className="slider-style"
            type="range"
            min="0"
            data-testid="horiz-pos"
            max="100"
            value={hPos}
            onChange={(event) => {
                event.preventDefault();
                dispatch(setHPos(event.target.value));
            }}
        />
    );
};

const ArtScrollerInvertColorsSliderLabel: React.FC = () => {
    const { invert } = getGlobalState(useSelector);
    return (
        <label htmlFor="invert" style={{ color: "white" }}>
            Invert Colors: {Number(invert) / 100}
        </label>
    );
};

type ArtScrollerInvertColorsSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerInvertColorsSlider: React.FC<ArtScrollerInvertColorsSliderProps> = () => {
    const { invert } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
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
    );
};

const ArtScrollerSpeedSliderLabel: React.FC = () => {
    const { animDuration } = getGlobalState(useSelector);
    return (
        <label htmlFor="animation-duration" style={{ color: "white" }}>
            Scroll Speed: {Number(animDuration) / 100}
        </label>
    );
};

type ArtScrollerSpeedSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerSpeedSlider: React.FC<ArtScrollerSpeedSliderProps> = () => {
    const { animDuration } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
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
    );
};

const Gifs: React.FC<{ gifs: IGif[] }> = (props) => {
    const { gifs } = props;
    const { invert, animDuration, vertPos, circleWidth, hPos } = getGlobalState(useSelector);
    return (
        <>
            {Array.isArray(gifs) &&
                gifs.map((gif, index) => (
                    <img
                        key={gif._id}
                        data-testid={`gif-${index}`}
                        id={`gif-${index}`}
                        alt={`gif-${index}`}
                        src={gif.gifSrc}
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
        </>
    );
};

const ArtScrollerGifs: React.FC = () => {
    const { figureOn, gifs } = getGlobalState(useSelector);
    return (
        <figure
            data-testid="gifs-container"
            style={{
                display: `${figureOn ? "block" : "none"}`,
                margin: "0",
            }}
            className="figure-transition-style"
        >
            <Gifs gifs={gifs} />
        </figure>
    );
};

export type {
    ArtScrollerStartButtonProps,
    ArtScrollerToggleButtonProps,
    ArtScrollerCircleWidthSliderProps,
    ArtScrollerVerticalPositionSliderProps,
    ArtScrollerHorizontalPositionSliderProps,
    ArtScrollerInvertColorsSliderProps,
};
export {
    ArtScrollerMainContainer,
    ArtScrollerSection,
    ArtScrollerBorderTop,
    ArtScrollerTitle,
    ArtScrollerGifButtonContainer,
    ArtScrollerStartButton,
    ArtScrollerToggleButton,
    ArtScrollerSliderContainer,
    ArtScrollerCircleWidthLabel,
    ArtScrollerCircleWidthSlider,
    ArtScrollerVerticalPositionSlider,
    ArtScrollerVerticalPositionSliderLabel,
    ArtScrollerHorizontalPositionSlider,
    ArtScrollerHorizontalPositionSliderLabel,
    ArtScrollerInvertColorsSliderLabel,
    ArtScrollerInvertColorsSlider,
    ArtScrollerSpeedSliderLabel,
    ArtScrollerSpeedSlider,
    ArtScrollerGifs,
};

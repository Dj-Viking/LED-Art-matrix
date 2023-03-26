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
} from "../actions/art-scroller-actions";
import "./aux-styles/artScrollerLayoutStyle.css";
import { BKeySvg } from "../lib/keySvgs";
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

const InvertColorsSliderLabel: React.FC = () => {
    const { invert } = getGlobalState(useSelector);
    return (
        <label htmlFor="invert" style={{ color: "white" }}>
            Invert Colors: {Number(invert) / 100}
        </label>
    );
};

export type {
    ArtScrollerStartButtonProps,
    ArtScrollerToggleButtonProps,
    ArtScrollerCircleWidthSliderProps,
    ArtScrollerVerticalPositionSliderProps,
    ArtScrollerHorizontalPositionSliderProps,
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
    InvertColorsSliderLabel,
};

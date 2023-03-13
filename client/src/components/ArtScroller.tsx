import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useSelector, useDispatch } from "react-redux";
import { _leftInitButtonSpring, _scrollerOnOffButtonSpring } from "./SpringButtons";
import "./aux-styles/artScrollerLayoutStyle.css";
import API from "../utils/ApiService";
import { getRandomIntLimit } from "../utils/helpers";
import {
    getGifs,
    setAnimDuration,
    setCircleWidth,
    setFigureOn,
    setHPos,
    setInvert,
    setVertPos,
} from "../actions/art-scroller-actions";
import { MyRootState } from "../types";
import { BKeySvg } from "../lib/keySvgs";

const ArtScroller: React.FC = (): JSX.Element => {
    const leftInitButtonSpring = useSpring(_leftInitButtonSpring);
    const scrollerOnOffButtonSpring = useSpring(_scrollerOnOffButtonSpring);
    const dispatch = useDispatch();
    const { gifs, animDuration, vertPos, hPos, circleWidth, invert, figureOn } = useSelector(
        (state: MyRootState) => state.artScrollerState
    );

    async function handleGetGifs(event: any): Promise<void> {
        event.persist();
        if (figureOn === false) dispatch(setFigureOn(true));
        const gifs = await API.getGifs();
        if (Array.isArray(gifs)) {
            if (gifs.length) {
                dispatch(getGifs(gifs));
            }
        }
    }

    return (
        <>
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <section>
                    <div className="border-top-artScroller" />
                    <span
                        style={{
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        Art Scroller Controls
                    </span>
                    <div className="gif-button-container">
                        <animated.button
                            style={leftInitButtonSpring}
                            role="button"
                            data-testid="start-art"
                            className="scroller-fetch-button"
                            onClick={handleGetGifs}
                        >
                            Start Art Scroller!
                        </animated.button>
                        <animated.button
                            role="button"
                            data-testid="switch-scroller"
                            style={scrollerOnOffButtonSpring}
                            className={
                                figureOn
                                    ? "scroller-toggle-button-on"
                                    : "scroller-toggle-button-off"
                            }
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
                    </div>
                    <div className="slider-container">
                        <label htmlFor="scroller-circle-width" style={{ color: "white" }}>
                            Scroller Circle Width: {circleWidth}
                        </label>
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
                        <label htmlFor="vertical-positioning" style={{ color: "white" }}>
                            Scroller Vert Positioning: {vertPos}
                        </label>
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
                        <label htmlFor="horizontal-positioning" style={{ color: "white" }}>
                            Scroller Horizontal Positioning: {Number(hPos) / 1000}
                        </label>
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
                        <label htmlFor="invert" style={{ color: "white" }}>
                            Invert Colors: {Number(invert) / 100}
                        </label>
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
                    </div>
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
                </section>
            </main>
        </>
    );
};

export default ArtScroller;

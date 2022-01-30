
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useSelector, useDispatch } from "react-redux";
import { _leftInitButtonSpring, _scrollerOnOffButtonSpring } from "./SpringButtons";
import "./aux-styles/artScrollerLayoutStyle.css";
import API from "../utils/ApiService";
import { getRandomIntLimit } from "../utils/helpers";
import { getGifs } from "../actions/art-scroller-actions";
import { MyRootState } from "../types";

const ArtScroller: React.FC = (): JSX.Element => {
  const leftInitButtonSpring = useSpring(_leftInitButtonSpring);
  const scrollerOnOffButtonSpring = useSpring(_scrollerOnOffButtonSpring);
  const dispatch = useDispatch();
  const { gifs } = useSelector((state: MyRootState) => state.artScrollerState);

  // create animation that scrolls opacity at different animation durations
  // for opacity only
  const [animationDurationState, setAnimationDurationState] = useState<string>("30");
  function handleAnimationDurationChange(event: any): void {
    setAnimationDurationState(event.target.value);
  }

  // position style state
  // input sliders for positioning the circle
  // maybe later can click and drag. and throw around
  const [verticalPositionState, setVerticalPositionState] = useState<string>("50");
  function handleVerticalPositionStateChange(event: any): void {
    setVerticalPositionState(event.target.value);
  }

  // horizontal position style state
  const [horizontalPositionState, setHorizontalPositionState] = useState<string>("33.4");
  function handleHorizontalPositionStateChange(event: any): void {
    setHorizontalPositionState(event.target.value);
  }

  // width of circle state maybe
  // input slider for widening the scroller
  const [scrollerCircleWidth, setScrollerCircleWidth] = useState<string>("30");
  function handleScrollerCircleWidthChange(event: any): void {
    setScrollerCircleWidth(event.target.value);
  }

  const [invertState, setInvertState] = useState<number>(0);
  function handleInvertChange(event: any): void {
    setInvertState(event.target.value);
  }

  const [figureIsOnState, setFigureIsOnState] = useState<boolean>(false);
  function handleFigureChange(): void {
    figureIsOnState ? setFigureIsOnState(false) : setFigureIsOnState(true);
  }

  async function handleGetGifs(event: any): Promise<void> {
    event.persist();
    if (figureIsOnState === false) setFigureIsOnState(true);
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
          flexDirection: "column"
        }}
      >
        <section>
          <div className="border-top-artScroller" />
          <span
            style={{
              color: "white",
              textAlign: "center"
            }}
          >
            Art Scroller Controls
          </span>
          <div
            className="preset-button-container"
          >

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
              className={figureIsOnState ? "scroller-toggle-button-on" : "scroller-toggle-button-off"}
              onClick={handleFigureChange}
            >
              {
                figureIsOnState
                ? <span style={{ color: "white" }}>Turn Off Scroller</span>
                : <span style={{ color: "white" }}>Turn On Scroller</span>
              }
            </animated.button>
          </div>
          <div
            className="slider-container"
          >
            <label
              htmlFor="scroller-circle-width"
              style={{ color: "white" }}
            >
              Scroller Circle Width: 
              {" "}
              {scrollerCircleWidth}
            </label>
            <input 
              name="scroller-circle-width"
              className="slider-style"
              type="range"
              data-testid="circle-width"
              min="0"
              max="100"
              value={scrollerCircleWidth}
              onChange={handleScrollerCircleWidthChange}
            />
            <label
              htmlFor="vertical-positioning"
              style={{ color: "white" }}
            >

              Scroller Vert Positioning: 
              {" "}
              {verticalPositionState}
            </label>
            <input 
              name="vertical-positioning"
              className="slider-style"
              data-testid="vert-pos"
              type="range"
              min="0"
              max="200"
              value={verticalPositionState}
              onChange={handleVerticalPositionStateChange}
            />
            <label
              htmlFor="horizontal-positioning"
              style={{ color: "white" }}
            >

              Scroller Horizontal Positioning: 
              {" "}
              {Number(horizontalPositionState) / 1000}
            </label>
            <input 
              name="horizontal-positioning"
              className="slider-style"
              type="range"
              min="0"
              data-testid="horiz-pos"
              max="100"
              value={horizontalPositionState}
              onChange={handleHorizontalPositionStateChange}
            />
            <label
              htmlFor="invert"
              style={{ color: "white" }}
            >
              Invert Colors: 
              {" "}
              {invertState / 100}
            </label>
            <input
              className="slider-style"
              name="invert"
              type="range"
              data-testid="invert"
              min="0"
              max="100"
              value={invertState}
              onChange={handleInvertChange}
            />
            <label
              htmlFor="animation-duration"
              style={{ color: "white" }}
            >
              Scroll Speed: 
              {" "}
              {Number(animationDurationState) / 100}
            </label>
            <input
              className="slider-style"
              name="animation-duration"
              type="range"
              data-testid="anim-duration"
              min="1"
              max="100"
              value={animationDurationState}
              onChange={handleAnimationDurationChange}
            />
          </div>
          <figure
            data-testid="gifs-container"
            style={{
              display: `${figureIsOnState ? "block" : "none"}`,
              margin: "0"
            }}
            className="figure-transition-style"
          >
            {
              Array.isArray(gifs)
              && gifs.map((gif, index) => (
                <img 
                  key={gif._id}
                  data-testid={`gif-${index}`}
                  id={`gif-${index}`}
                  alt={`gif-${index}`}
                  src={gif.gifSrc as string}
                  style={{
                    position: "absolute",
                    // @ts-expect-error whatever
                    zIndex: "1",
                    // opacity: `${opacityState/100}`,
                    filter: `invert(${invertState / 100})`,
                    borderRadius: "50%",
                    animationName: "scrollAnim",
                    animationDuration: `${Number(animationDurationState) / 100 * (index + getRandomIntLimit(index, 20))}s`,
                    animationDelay: `0.${index + 1}`,
                    animationTimingFunction: "ease-in",
                    animationDirection: "reverse",
                    animationIterationCount: "infinite",
                    top: `${verticalPositionState}vh`,
                    width: `${scrollerCircleWidth}vw`,
                    left: `${horizontalPositionState}vw`
                  }}
                  className="scroller-media"
                />
              ))
            }
          </figure>
        </section>
      </main>
    </>
  );
};

export default ArtScroller;

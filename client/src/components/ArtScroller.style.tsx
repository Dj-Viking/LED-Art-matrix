import React, { DOMAttributes } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import {
    _leftInitButtonSpring,
    _scrollerOnOffButtonSpring,
    _scrollerSaveGifsButtonSpring,
} from "./SpringButtons";
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
    setListName,
} from "../actions/art-scroller-actions";
import { BKeySvg } from "../lib/keySvgs";
import { IGif } from "../types";
import { getRandomIntLimit } from "../utils/helpers";
import "./aux-styles/artScrollerLayoutStyle.css";
import AuthService from "../utils/AuthService";

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

type ArtScrollerStartButtonProps = DOMAttributes<HTMLButtonElement> & {
    auth: typeof AuthService;
};

const ArtScrollerStartButton: React.FC<ArtScrollerStartButtonProps> = (props) => {
    const leftInitButtonSpring = useSpring(_leftInitButtonSpring);
    const dispatch = useDispatch();
    const { figureOn } = getGlobalState(useSelector);

    async function handleGetNew(): Promise<void> {
        if (!figureOn) dispatch(setFigureOn(true));

        let gifs: IGif[] = [];

        gifs = (await API.getUnloggedInGifs(true)) as IGif[];
        dispatch(setGifs(gifs));
        dispatch(setListName(gifs[0]?.listName));
    }

    async function handleClick(): Promise<void> {
        if (figureOn === false) dispatch(setFigureOn(true));

        let gifs = [] as IGif[] | IGif;

        if (props.auth.loggedIn()) {
            gifs = ((await API.getGifs(props.auth.getToken() as string, true)) as IGif[]) || [];
            dispatch(setGifs(gifs));
            dispatch(setListName(gifs[0]?.listName));
        } else {
            gifs = (await API.getUnloggedInGifs()) as IGif[];
            dispatch(setGifs(gifs));
            dispatch(setListName("free"));
        }
    }
    return (
        <>
            <animated.button
                style={leftInitButtonSpring}
                role="button"
                data-testid="get-new"
                className="scroller-fetch-button"
                onClick={() => (async () => handleGetNew())()}
            >
                Get New GIFs
            </animated.button>
            <animated.button
                style={leftInitButtonSpring}
                role="button"
                data-testid="start-art"
                className="scroller-fetch-button"
                onClick={() => (async () => handleClick())()}
            >
                Start Art Scroller!
            </animated.button>
        </>
    );
};

type ArtScrollerToggleButtonProps = DOMAttributes<HTMLButtonElement>;

const ArtScrollerToggleButton: React.FC<ArtScrollerToggleButtonProps> = () => {
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

type ArtScrollerMakeNewGifCollectionProps = React.DOMAttributes<HTMLButtonElement> & {
    auth: typeof AuthService;
};

const ArtScrollerMakeNewGifCollection: React.FC<ArtScrollerMakeNewGifCollectionProps> = (props) => {
    const scrollerSaveGifsButtonSpring = useSpring(_scrollerSaveGifsButtonSpring);
    const { gifs } = getGlobalState(useSelector);
    const onClick = (event: any): void => {
        event.preventDefault();
        if (!props.auth.loggedIn() || gifs.length === 0) {
            return;
        }
        (async () => {
            // call to save gifs to user's collection of gifs
            await API.createGifs(props.auth.getToken() as string, gifs);
        })();
    };
    return (
        <>
            <animated.button
                role="button"
                disabled={!props.auth.loggedIn()}
                data-testid="save-gifs"
                style={scrollerSaveGifsButtonSpring}
                onClick={onClick}
                type="button"
                className={props.auth.loggedIn() ? "gif-save-button" : "gif-save-button-disabled"}
            >
                Save Scroller Gifs
            </animated.button>
        </>
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

const ArtScrollerGifListSelector: React.FC = () => {
    const { gifs, listName } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <div style={{ margin: "0 auto", width: "70%" }}>
            <select
                value={listName || "Choose a gif list"}
                name="gif-list-selector"
                id="gif-list-selector"
                style={{ textAlign: "center", backgroundColor: "black", width: "100%" }}
                onChange={(event: any) => {
                    dispatch(setListName(event.target.value));
                }}
            >
                <option disabled value="Choose a gif list">
                    Choose a gif list
                </option>
                {Array.isArray(gifs) &&
                    gifs.length > 0 &&
                    gifs.map((gif) => {
                        return (
                            <option
                                key={gif._id}
                                id={gif._id + "-" + gif.listOwner}
                                data-testid={gif._id + "-" + gif.listOwner}
                                value={gif.listName}
                            >
                                {gif.listName}
                            </option>
                        );
                    })}
            </select>
        </div>
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

// TODO: adjust this so that different lists of gifs can be chosen
const Gifs: React.FC<{ auth: typeof AuthService }> = (props) => {
    const { gifs, invert, animDuration, vertPos, circleWidth, hPos, listName } =
        getGlobalState(useSelector);

    const dispatch = useDispatch();
    let _gifs = gifs?.filter((gif) => gif.listName === listName);

    React.useEffect(() => {
        (async () => {
            if (props.auth.loggedIn()) {
                const userGifs = (await API.getGifs(
                    props.auth.getToken() as string,
                    true
                )) as IGif[];
                dispatch(setGifs(userGifs));
                dispatch(setListName(userGifs[0]?.listName || "test"));
            } else {
                const freeGifs = (await API.getUnloggedInGifs()) as IGif[];
                dispatch(setGifs(freeGifs));
                dispatch(setListName("free"));
            }
        })();
    }, [dispatch, props.auth]);

    return (
        <>
            {Array.isArray(_gifs) &&
                !!_gifs[0]?.gifSrcs &&
                _gifs[0].gifSrcs.map((src, index) => (
                    <img
                        key={src}
                        data-testid={`gif-${index}`}
                        id={`gif-${src}`}
                        alt={`gif-${src}`}
                        src={src}
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

const ArtScrollerGifs: React.FC<{ auth: typeof AuthService }> = (props) => {
    const { figureOn } = getGlobalState(useSelector);
    return (
        <figure
            data-testid="gifs-container"
            style={{
                display: `${figureOn ? "block" : "none"}`,
                margin: "0",
            }}
            className="figure-transition-style"
        >
            <Gifs auth={props.auth} />
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
    ArtScrollerMakeNewGifCollectionProps,
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
    ArtScrollerMakeNewGifCollection,
    ArtScrollerGifListSelector,
};

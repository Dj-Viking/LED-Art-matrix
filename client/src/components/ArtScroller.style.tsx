import React, { DOMAttributes } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import {
    _leftInitButtonSpring,
    _scrollerOnOffButtonSpring,
    _scrollerSaveGifsButtonSpring,
} from "./SpringButtons";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalState } from "../store/store";

import { artScrollerActions } from "../store/artScrollerSlice";
import { BKeySvg } from "../lib/keySvgs";
import { getRandomIntLimit } from "../utils/helpers";
import "./aux-styles/artScrollerLayoutStyle.css";
import AuthService from "../utils/AuthService";
import { modalActions } from "../store/modalSlice";
import { midiActions } from "../store/midiSlice";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import { UIInterfaceDeviceName } from "../constants";

const ArtScrollerMainContainer = styled.main`
    display: flex;
    flex-direction: column;
`;

function listeningForEditsHandler(
    dispatch: React.Dispatch<any>,
    uiName: UIInterfaceDeviceName
): void {
    console.log("listening for edits");
    dispatch(midiActions.setListeningForMappingEdit(true));
    dispatch(
        midiActions.setMappingEditOptions({
            uiName: uiName,
        })
    );
}

const ArtScrollerSection: React.FC = ({ children }) => {
    return (
        <section style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {children}
        </section>
    );
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
                margin: "0 auto",
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

    async function handleGetNew(): Promise<void> {
        if (!figureOn) {
            dispatch(artScrollerActions.setFigureOn(true));
        }

        dispatch(artScrollerActions.getGifsAsync({ getNew: true }));
    }

    async function handleClick(): Promise<void> {
        if (figureOn === false) {
            dispatch(artScrollerActions.setFigureOn(true));
        }
    }
    return (
        <>
            <animated.button
                style={leftInitButtonSpring}
                role="button"
                data-testid="get-new"
                className="scroller-fetch-button"
                onClick={handleGetNew}
            >
                Get New GIFs
            </animated.button>
            <animated.button
                style={leftInitButtonSpring}
                role="button"
                data-testid="start-art"
                className="scroller-fetch-button"
                onClick={handleClick}
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
                dispatch(artScrollerActions.setFigureOn(!figureOn));
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

type ArtScrollerMakeNewGifCollectionProps = React.DOMAttributes<HTMLButtonElement>;

const ArtScrollerMakeNewGifCollection: React.FC<ArtScrollerMakeNewGifCollectionProps> = () => {
    const dispatch = useDispatch();
    const scrollerSaveGifsButtonSpring = useSpring(_scrollerSaveGifsButtonSpring);
    const { gifs, listName } = getGlobalState(useSelector);

    const onClick = (event: any): void => {
        event.preventDefault();

        dispatch(modalActions.setGifModalIsOpen(true));
        dispatch(
            modalActions.setGifModalContext({
                listName: listName,
                gif: gifs.filter((gif) => gif.listName === listName)[0],
            })
        );
    };

    return (
        <>
            <animated.button
                role="button"
                disabled={!AuthService.loggedIn()}
                data-testid="save-gifs"
                style={scrollerSaveGifsButtonSpring}
                onClick={onClick}
                type="button"
                className={AuthService.loggedIn() ? "gif-save-button" : "gif-save-button-disabled"}
            >
                Save Scroller Gifs
            </animated.button>
        </>
    );
};

const StyledSliderContainer = styled.div`
    & {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

const ArtScrollerSliderContainer: React.FC = ({ children }) => {
    return <StyledSliderContainer>{children}</StyledSliderContainer>;
};

const ArtScrollerCircleWidthLabel: React.FC = () => {
    const {
        slider: { circleWidth },
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);

    // controlName
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "circleWidth"
    );

    return (
        <StyledSliderLabel htmlFor="scroller-circle-width">
            {midiEditMode && `<MIDI> (${uiMapping})`} Scroller Circle Width: {circleWidth}
        </StyledSliderLabel>
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
                onChange={(event) => {
                    dispatch(artScrollerActions.setListName(event.target.value));
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
    const {
        slider: { circleWidth },
    } = getGlobalState(useSelector);
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
            onClick={() => {
                listeningForEditsHandler(dispatch, "circleWidth");
            }}
            onChange={(event) => {
                event.preventDefault();
                dispatch(
                    artScrollerActions.setSlider({
                        control: "circleWidth",
                        value: event.target.value,
                    })
                );
            }}
        />
    );
};

const ArtScrollerVerticalPositionSliderLabel: React.FC = () => {
    const {
        slider: { vertPos },
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "vertPos"
    );
    return (
        <StyledSliderLabel htmlFor="vertical-positioning">
            {midiEditMode && `<MIDI> (${uiMapping})`} Scroller Vert Positioning: {vertPos}
        </StyledSliderLabel>
    );
};
type ArtScrollerVerticalPositionSliderProps = DOMAttributes<HTMLInputElement>;

export const StyledSlider = styled.input`
    & {
        width: 70%;
        margin: 0 auto;
    }
`;

const ArtScrollerVerticalPositionSlider: React.FC<ArtScrollerVerticalPositionSliderProps> = () => {
    const {
        slider: { vertPos },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <StyledSlider
            name="vertical-positioning"
            data-testid="vert-pos"
            type="range"
            min="0"
            max="200"
            value={vertPos}
            onClick={() => {
                listeningForEditsHandler(dispatch, "vertPos");
            }}
            onChange={(event) => {
                event.preventDefault();
                dispatch(
                    artScrollerActions.setSlider({
                        control: "vertPos",
                        value: event.target.value,
                    })
                );
            }}
        />
    );
};

const ArtScrollerHorizontalPositionSliderLabel: React.FC = () => {
    const {
        slider: { hPos },
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "hPos"
    );
    return (
        <StyledSliderLabel htmlFor="horizontal-positioning">
            {midiEditMode && `<MIDI> (${uiMapping})`} Scroller Horizontal Positioning:{" "}
            {Number(hPos) / 1000}
        </StyledSliderLabel>
    );
};

type ArtScrollerHorizontalPositionSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerHorizontalPositionSlider: React.FC<
    ArtScrollerHorizontalPositionSliderProps
> = () => {
    const {
        slider: { hPos },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <StyledSlider
            name="horizontal-positioning"
            type="range"
            min="0"
            data-testid="horiz-pos"
            max="100"
            value={hPos}
            onChange={(event) => {
                event.preventDefault();
                dispatch(
                    artScrollerActions.setSlider({
                        control: "hPos",
                        value: event.target.value,
                    })
                );
            }}
        />
    );
};

export const StyledSliderLabel = styled.label`
    & {
        color: white;
        margin: 0 auto;
    }
`;

const ArtScrollerInvertColorsSliderLabel: React.FC = () => {
    const {
        slider: { invert },
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "invert"
    );
    return (
        <StyledSliderLabel htmlFor="invert">
            {midiEditMode && `<MIDI> (${uiMapping})`} Invert Colors: {Number(invert) / 100}
        </StyledSliderLabel>
    );
};

type ArtScrollerInvertColorsSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerInvertColorsSlider: React.FC<ArtScrollerInvertColorsSliderProps> = () => {
    const {
        slider: { invert },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <StyledSlider
            name="invert"
            type="range"
            data-testid="invert"
            min="0"
            max="100"
            value={invert}
            onChange={(event) => {
                event.preventDefault();
                dispatch(
                    artScrollerActions.setSlider({
                        control: "invert",
                        value: event.target.value,
                    })
                );
            }}
        />
    );
};

const ArtScrollerSpeedSliderLabel: React.FC = () => {
    const {
        slider: { animDuration },
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "animDuration"
    );
    return (
        <StyledSliderLabel htmlFor="animation-duration">
            {midiEditMode && `<MIDI> (${uiMapping})`} Scroll Speed: {Number(animDuration) / 100}
        </StyledSliderLabel>
    );
};

type ArtScrollerSpeedSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerSpeedSlider: React.FC<ArtScrollerSpeedSliderProps> = () => {
    const {
        slider: { animDuration },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <StyledSlider
            name="animation-duration"
            type="range"
            data-testid="anim-duration"
            min="1"
            max="100"
            value={animDuration}
            onChange={(event) => {
                event.preventDefault();
                dispatch(
                    artScrollerActions.setSlider({
                        control: "animDuration",
                        value: event.target.value,
                    })
                );
            }}
        />
    );
};

// TODO: adjust this so that different lists of gifs can be chosen
const Gifs: React.FC = () => {
    const {
        slider: { invert, animDuration, vertPos, circleWidth, hPos },
        listName,
        gifs,
    } = getGlobalState(useSelector);

    let _gifs = gifs?.filter((gif) => gif.listName === listName);

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

const ArtScrollerGifs: React.FC = () => {
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
            <Gifs />
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

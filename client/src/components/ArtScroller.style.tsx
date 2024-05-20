import React, { DOMAttributes } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { _leftInitButtonSpring, _scrollerOnOffButtonSpring, _scrollerSaveGifsButtonSpring } from "./SpringButtons";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalState } from "../store/store";

import { artScrollerActions } from "../store/artScrollerSlice";
import { BKeySvg } from "../lib/keySvgs";
import { getRandomIntLimit } from "../utils/helpers";
import "./aux-styles/artScrollerLayoutStyle.css";
import AuthService from "../utils/AuthService";
import { modalActions } from "../store/modalSlice";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import { keyGen } from "../utils/keyGen";

const ArtScrollerMainContainer = styled.main`
    display: flex;
    flex-direction: column;
`;

const ArtScrollerSection: React.FC = ({ children }) => {
    return <section style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</section>;
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

const StyledMIDIGifButton = styled.div`
    & {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    & > div > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
`;

const MIDIMappingDisplay: React.FC<{ isMIDIEditMode: boolean; mappingText: string }> = (props) => {
    return (
        <div>
            {props.isMIDIEditMode && (
                <div>
                    <span>{"< MIDI >"}</span>
                    <span>{`(${props.mappingText})`}</span>
                </div>
            )}
        </div>
    );
};

type ArtScrollerStartButtonProps = DOMAttributes<HTMLButtonElement>;

const ArtScrollerStartButton: React.FC<ArtScrollerStartButtonProps> = () => {
    const leftInitButtonSpring = useSpring(_leftInitButtonSpring);
    const dispatch = useDispatch();
    const { figureOn, midiEditMode, midiMappingInUse, controllerInUse } = getGlobalState(useSelector);

    const gifFetchUiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "gifFetch"
    );

    const startGifsUiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "startGifs"
    );

    async function handleGetNewClickHandler(): Promise<void> {
        if (midiEditMode) {
            MIDIMappingPreference.listeningForEditsHandler(dispatch, "gifFetch");
            return;
        }
        if (!figureOn) {
            dispatch(artScrollerActions.setFigureOn(true));
        }

        dispatch(artScrollerActions.getNewGifsAsync());
    }

    async function gifStartClickHandler(): Promise<void> {
        if (midiEditMode) {
            MIDIMappingPreference.listeningForEditsHandler(dispatch, "startGifs");
            return;
        }
        if (figureOn === false) {
            dispatch(artScrollerActions.setFigureOn(true));
        }
    }
    return (
        <>
            <StyledMIDIGifButton>
                <MIDIMappingDisplay isMIDIEditMode={midiEditMode} mappingText={gifFetchUiMapping} />
                <animated.button
                    style={{ ...leftInitButtonSpring, height: 50 }}
                    role="button"
                    data-testid="get-new"
                    className="scroller-fetch-button"
                    onClick={handleGetNewClickHandler}
                >
                    Get New GIFs
                </animated.button>
            </StyledMIDIGifButton>
            <StyledMIDIGifButton>
                <MIDIMappingDisplay isMIDIEditMode={midiEditMode} mappingText={startGifsUiMapping} />
                <animated.button
                    style={{ ...leftInitButtonSpring, height: 50 }}
                    role="button"
                    data-testid="start-art"
                    className="scroller-fetch-button"
                    onClick={gifStartClickHandler}
                >
                    Start Art Scroller!
                </animated.button>
            </StyledMIDIGifButton>
        </>
    );
};

type ArtScrollerToggleButtonProps = DOMAttributes<HTMLButtonElement>;

const ArtScrollerToggleButton: React.FC<ArtScrollerToggleButtonProps> = () => {
    const scrollerOnOffButtonSpring = useSpring(_scrollerOnOffButtonSpring);
    const dispatch = useDispatch();
    const { figureOn, midiEditMode, midiMappingInUse, controllerInUse, listNames } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "figureOn"
    );
    return (
        <StyledMIDIGifButton>
            <MIDIMappingDisplay isMIDIEditMode={midiEditMode} mappingText={uiMapping} />
            <animated.button
                role="button"
                data-testid="switch-scroller"
                style={scrollerOnOffButtonSpring}
                className={figureOn ? "scroller-toggle-button-on" : "scroller-toggle-button-off"}
                onClick={(event) => {
                    event.preventDefault();
                    if (midiEditMode) {
                        MIDIMappingPreference.listeningForEditsHandler(dispatch, "figureOn");
                        return;
                    }
                    if (listNames.length === 0) {
                        dispatch(artScrollerActions.getNewGifsAsync());
                    }
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
        </StyledMIDIGifButton>
    );
};

type ArtScrollerSaveNewGifCollectionProps = React.DOMAttributes<HTMLButtonElement>;

const ArtScrollerSaveNewGifCollection: React.FC<ArtScrollerSaveNewGifCollectionProps> = () => {
    const dispatch = useDispatch();
    const scrollerSaveGifsButtonSpring = useSpring(_scrollerSaveGifsButtonSpring);
    const { gifs, listName } = getGlobalState(useSelector);

    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
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

const StyledSliderContainer = styled.div<{ midiEditMode: boolean }>`
    & {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: ${(props) => (props.midiEditMode ? "60px" : "20px")};
    }
`;

const ArtScrollerSliderContainer: React.FC = ({ children }) => {
    const { midiEditMode } = getGlobalState(useSelector);
    return <StyledSliderContainer midiEditMode={midiEditMode}>{children}</StyledSliderContainer>;
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
    const { gifs, listName, midiEditMode, midiMappingInUse, controllerInUse } = getGlobalState(useSelector);

    const uiName = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "gifSelector"
    );

    const dispatch = useDispatch();

    return (
        <div
            style={{
                margin: "0 auto",
                width: "70%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <MIDIMappingDisplay isMIDIEditMode={midiEditMode} mappingText={uiName} />
            <select
                value={listName || "Choose a gif list"}
                onClick={() => {
                    if (midiEditMode) {
                        MIDIMappingPreference.listeningForEditsHandler(dispatch, "gifSelector");
                    }
                }}
                name="gif-list-selector"
                id="gif-list-selector"
                style={{ textAlign: "center", backgroundColor: "black", width: "100%" }}
                onChange={(event) => {
                    dispatch(
                        artScrollerActions.selectListName({
                            listName: event.target.value,
                            listNameIndex: event.target.id,
                        })
                    );
                }}
            >
                <option disabled value="Choose a gif list">
                    Choose a gif list
                </option>
                {Array.isArray(gifs) &&
                    gifs.length > 0 &&
                    gifs.map((gif, index) => {
                        return (
                            <option
                                key={gif._id + keyGen()}
                                id={index.toString()}
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
            style={{
                width: "70%",
                margin: "5px auto",
            }}
            className="myrangestyle"
            type="range"
            data-testid="circle-width"
            min="0"
            max="100"
            value={circleWidth}
            onClick={() => {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, "circleWidth");
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

const ArtScrollerVerticalPositionSlider: React.FC<ArtScrollerVerticalPositionSliderProps> = () => {
    const {
        slider: { vertPos },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <input
            style={{
                width: "70%",
                margin: "5px auto",
            }}
            name="vertical-positioning"
            data-testid="vert-pos"
            className="myrangestyle"
            type="range"
            min="0"
            max="200"
            value={vertPos}
            onClick={() => {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, "vertPos");
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
            {midiEditMode && `<MIDI> (${uiMapping})`} Scroller Horizontal Positioning: {Number(hPos) / 1000}
        </StyledSliderLabel>
    );
};

type ArtScrollerHorizontalPositionSliderProps = DOMAttributes<HTMLInputElement>;

const ArtScrollerHorizontalPositionSlider: React.FC<ArtScrollerHorizontalPositionSliderProps> = () => {
    const {
        slider: { hPos },
    } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <input
            className="myrangestyle"
            style={{
                width: "70%",
                margin: "5px auto",
            }}
            name="horizontal-positioning"
            type="range"
            min="0"
            data-testid="horiz-pos"
            max="100"
            value={hPos}
            onClick={() => {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, "hPos");
            }}
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
        <input
            className="myrangestyle"
            style={{
                width: "70%",
                margin: "5px auto",
            }}
            name="invert"
            type="range"
            data-testid="invert"
            min="0"
            max="100"
            value={invert}
            onClick={() => {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, "invert");
            }}
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
        <input
            className="myrangestyle"
            style={{
                width: "70%",
                margin: "5px auto",
            }}
            name="animation-duration"
            type="range"
            data-testid="anim-duration"
            min="1"
            max="100"
            value={animDuration}
            onClick={() => {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, "animDuration");
            }}
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
                        id={`gif-${keyGen()}`}
                        alt={"somegif"}
                        src={src}
                        style={{
                            position: "absolute",
                            // satisfies type export type ZIndex = Globals | "auto" | (number & {});
                            zIndex: 1,
                            filter: `invert(${Number(invert) / 100})`,
                            borderRadius: "50%",
                            animationName: "scrollAnim",
                            animationDuration: `${
                                (Number(animDuration) / 100) * (index + getRandomIntLimit(index, 20))
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
    ArtScrollerSaveNewGifCollectionProps,
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
    ArtScrollerSaveNewGifCollection,
    ArtScrollerGifListSelector,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";
import { modalActions } from "../store/modalSlice";
import { getGlobalState } from "../store/store";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import "./aux-styles/ledSliderStyles.css";
import { audioActions } from "../store/audioSlice";

interface SliderProps {
    [key: string]: any;
}

const Slider: React.FC<SliderProps> = () => {
    const dispatch = useDispatch();
    const { midiEditMode, midiMappingInUse, controllerInUse, presetName, animVarCoeff } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "animVarCoeff"
    );
    const handleChange = React.useCallback(
        (event) => {
            dispatch(ledActions.setAnimVarCoeff(event.target.value));
            dispatch(
                modalActions.setSaveModalContext({
                    presetName: presetName,
                    animVarCoeff: event.target.value,
                })
            );
        },
        [dispatch, presetName]
    );
    const name = "led-anim-var";
    return (
        <>
            <div className="led-slider-container">
                <label
                    htmlFor={name}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "white",
                        margin: "0 auto",
                    }}
                >
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>
                        {midiEditMode ? `<MIDI> (${uiMapping})` : ""}
                    </p>
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>{"LED Animation Variation"}</p>
                    <p style={{ margin: "0 auto" }}>{animVarCoeff}</p>
                </label>

                {/* TODO figure out what kinds of labels to use for particular sliders */}
                <span style={{ color: "white", marginLeft: "20%" }}>
                    &nbsp; <span style={{ color: "white", marginLeft: "60%" }}>&nbsp;</span>
                </span>

                <input
                    name={name}
                    style={{
                        width: "70%",
                        margin: "0 auto",
                    }}
                    className="myrangestyle"
                    data-testid={"led-anim-variation"}
                    type="range"
                    min="1"
                    max="255"
                    onClick={() => {
                        MIDIMappingPreference.listeningForEditsHandler(dispatch, "animVarCoeff");
                    }}
                    value={animVarCoeff}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export const AudioSliderThing1: React.FC<SliderProps> = () => {
    const dispatch = useDispatch();
    const { 
        analyserNodeRef, 
        midiMappingInUse, 
        controllerInUse,
        midiEditMode 
    } = getGlobalState(useSelector);

    const [smoothing, setsmoothing] = React.useState(0);

    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "smoothing"
    );
    const handleChange = React.useCallback(
        (event) => {
            if (analyserNodeRef
                && analyserNodeRef.current
            ) {
                dispatch(
                    audioActions.setAnalyserRefSmoothing(
                        Number(
                            event.target.value
                        )
                    )
                );
            }
            setsmoothing(event.target.value);
        },
        [dispatch, analyserNodeRef]
    );

    React.useEffect(() => {
        if (analyserNodeRef.current) {
            if (analyserNodeRef.current.smoothingTimeConstant >= 0.09) {
                setsmoothing(analyserNodeRef.current.smoothingTimeConstant);
            } else {
                setsmoothing(0);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(analyserNodeRef && analyserNodeRef.current)?.smoothingTimeConstant, analyserNodeRef]);

    const name = "smoothing";
    return (
        <>
            <div className="led-slider-container">
                <label
                    htmlFor={name}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "white",
                        margin: "0 auto",
                    }}
                >
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>
                        {midiEditMode ? `<MIDI> (${uiMapping})` : ""}
                    </p>
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>{"Audio Analyser Smoothing"}</p>
                    <p style={{ margin: "0 auto" }}>{smoothing}</p>
                </label>

                <span style={{ color: "white", marginLeft: "20%" }}>
                    &nbsp; <span style={{ color: "white", marginLeft: "60%" }}>&nbsp;</span>
                </span>

                <input
                    name={name}
                    style={{
                        width: "70%",
                        margin: "0 auto",
                    }}
                    className="myrangestyle"
                    data-testid={"analyser-node-smoothing"}
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    onClick={() => {
                        midiEditMode && MIDIMappingPreference.listeningForEditsHandler(dispatch, "smoothing");
                    }}
                    value={smoothing}
                    onChange={(e) => {
                        if (!midiEditMode) {
                            handleChange(e);
                        }
                    }}
                />
            </div>
        </>
    );
};

// some part of the canvas HSL wheel constants...
export const AudioSliderThing2: React.FC<SliderProps> = () => {
    const dispatch = useDispatch();
    const { 
        energyModifier,
        midiMappingInUse, 
        controllerInUse,
        midiEditMode 
    } = getGlobalState(useSelector);

    const [energy, setenergy] = React.useState(0);

    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "energy"
    );
    const handleChange = React.useCallback(
        (event) => {
            if (Number.isInteger(energyModifier)) {
                dispatch(
                    audioActions.setEnergyModifier(
                        Number(
                            event.target.value
                        )
                    )
                );
            }
            setenergy(event.target.value);
        },
        [dispatch, energyModifier]
    );

    React.useEffect(() => {
        if (Number.isInteger(energyModifier)) {
            setenergy(energyModifier);
        }
    }, [energyModifier]);

    const name = "energy";
    return (
        <>
            <div className="led-slider-container">
                <label
                    htmlFor={name}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "white",
                        margin: "0 auto",
                    }}
                >
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>
                        {midiEditMode ? `<MIDI> (${uiMapping})` : ""}
                    </p>
                    {/** label.. */}
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>
                        {"Energy"}
                    </p>
                    <p style={{ margin: "0 auto" }}>{energy}</p>
                </label>

                <span style={{ color: "white", marginLeft: "20%" }}>
                    &nbsp; <span style={{ color: "white", marginLeft: "60%" }}>&nbsp;</span>
                </span>

                <input
                    name={name}
                    style={{
                        width: "70%",
                        margin: "0 auto",
                    }}
                    className="myrangestyle"
                    data-testid={"analyser-node-energy"}
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    onClick={() => {
                        midiEditMode && MIDIMappingPreference.listeningForEditsHandler(dispatch, "energy");
                    }}
                    value={energy}
                    onChange={(e) => {
                        if (!midiEditMode) {
                            handleChange(e);
                        }
                    }}
                />
            </div>
        </>
    );
};

export { Slider };

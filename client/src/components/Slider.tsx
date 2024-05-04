import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";
import { modalActions } from "../store/modalSlice";
import { getGlobalState } from "../store/store";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import "./aux-styles/ledSliderStyles.css";

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

export { Slider };

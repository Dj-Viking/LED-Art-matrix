import React from "react";
import { useSelector } from "react-redux";
import { getGlobalState } from "../store/store";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import "./aux-styles/ledSliderStyles.css";

interface SliderProps {
    inputValueState: string;
    name: string;
    testid: string;
    label: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider: React.FC<SliderProps> = ({ inputValueState, name, testid, label, handleChange }) => {
    const { midiEditMode, midiMappingInUse, controllerInUse } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.mapping[controllerInUse],
        "animVarCoeff"
    );
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
                        {midiEditMode ? `<MIDI> ${uiMapping}` : ""}
                    </p>
                    <p style={{ margin: "0 auto", marginBottom: "5px" }}>{label}</p>
                    <p style={{ margin: "0 auto" }}>{inputValueState}</p>
                </label>

                {/* TODO figure out what kinds of labels to use for particular sliders */}
                <span style={{ color: "white", marginLeft: "20%" }}>
                    &nbsp; <span style={{ color: "white", marginLeft: "60%" }}>&nbsp;</span>
                </span>

                <input
                    name={name}
                    className="slider-style"
                    data-testid={testid}
                    type="range"
                    min="1"
                    max="255"
                    value={inputValueState || "64"}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export { Slider };

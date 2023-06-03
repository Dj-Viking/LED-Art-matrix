import React from "react";
import "./aux-styles/ledSliderStyles.css";

interface SliderProps {
    inputValueState: string;
    name: string;
    testid: string;
    label: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider: React.FC<SliderProps> = ({ inputValueState, name, testid, label, handleChange }) => {
    return (
        <>
            <div className="led-slider-container">
                <label htmlFor={name} style={{ color: "white", margin: "0 auto" }}>
                    {label}
                    {inputValueState}
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

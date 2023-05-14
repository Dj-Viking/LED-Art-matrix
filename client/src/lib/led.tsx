import React from "react";
import { keyGen } from "../utils/keyGen";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";
import MIDIListenerWrapper from "../components/MIDIListenerWrapper";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";

const LedSVG: React.FC<{ range: string }> = (props) => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="32" height="32" rx="5" fill={`hsl(${props.range}, 100%, 50%)`} />
        </svg>
    );
};

export const LedSVGGrid: React.FC = () => {
    const dispatch = useDispatch();
    const { animVarCoeff } = getGlobalState(useSelector);

    return (
        <>
            <MIDIListenerWrapper />
            <div>
                <input
                    type="range"
                    min={0}
                    max={360}
                    value={animVarCoeff}
                    onInput={(e) => {
                        dispatch(ledActions.setAnimVarCoeff(e.target.value));
                    }}
                />
                <span>{animVarCoeff}</span>
            </div>

            {new Array(LedStyleEngine.LED_AMOUNT).fill(null).map((_, index) => {
                return (
                    <div style={{ height: 32 }} key={index}>
                        {new Array(LedStyleEngine.LED_AMOUNT).fill(null).map((_, i) => {
                            return <LedSVG range={animVarCoeff} key={`${i} - ${keyGen()}`} />;
                        })}
                    </div>
                );
            })}
        </>
    );
};

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ledActions } from "../store/ledSlice";
import { getGlobalState } from "../store/store";

export const CanvasControls: React.FC<{ resetCountRef: () => void }> = (props) => {
    const { isHSL } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    return (
        <>
            <button
                style={{ color: "black", width: "50%", margin: "0 auto" }}
                onClick={() => dispatch(ledActions.toggleIsHSL())}
            >
                {isHSL ? "SWITCH TO HEX RGB" : "SWITCH TO HSL"}
            </button>
            <button
                style={{ color: "black", width: "50%", margin: "0 auto" }}
                onClick={() => props.resetCountRef()}
            >
                reset animation timer
            </button>
            <span style={{ margin: "0 auto" }}>{isHSL ? "HSL" : "HEX RGB"}</span>
        </>
    );
};

import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { artScrollerActions } from "../store/artScrollerSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { ledActions } from "../store/ledSlice";
import { IPresetButton } from "../types";
import { getGlobalState } from "../store/store";
import { midiActions } from "../store/midiSlice";
import { audioActions } from "../store/audioSlice";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";

const KeyListenerWrapper: React.FC = ({ children }): JSX.Element => {
    const dispatch = useDispatch();
    const {
        deleteModeActive,
        presetButtons,
        saveModalIsOpen,
        figureOn,
        usingMidi,
        started
    } = getGlobalState(useSelector);

    // TODO: set style with analyserPresetname also
    // call this instaed PresetButtonsList.setStyle method
    const setStyle = useCallback(
        (preset: IPresetButton): void => {
            PresetButtonsList.setStyle(dispatch, preset);
        },
        [dispatch]
    );

    const handleKeyPress = useCallback(
        (event: KeyboardEvent): void => {
            if (deleteModeActive) return;
            if (saveModalIsOpen) return;


            //clear led screen
            // TODO: change the LED styles to still have the dimensions of being empty but no color as to not remove the dimensional grid from the DOM
            if (event.key === "c" || event.key === "C") {
                dispatch(ledActions.setPresetName(""));
                dispatch(presetButtonsListActions.setAllInactive());
            }

            if (event.key === "m" || event.key === "M") {
                if (usingMidi) {
                    dispatch(midiActions.resetState());
                } else {
                    dispatch(midiActions.toggleUsingMidi());
                }
            }

            // be careful if a button is assigned to A key
            // it will trigger that button too
            if (event.key === "a" || event.key === "A") {
                if (started) {
                    // Note: handle keypress some other way if you want
                    return;
                }
                dispatch(audioActions.setStarted(!started));
            }

            if (event.key === "b" || event.key === "B") {
                dispatch(artScrollerActions.setFigureOn(figureOn ? false : true));
            }

            // handle keypresses that are dynamically assigned
            // to the preset buttons
            const preset = presetButtons.filter((btn) => btn.keyBinding === event.key)[0] as IPresetButton;

            if (!preset) return;

            setStyle(preset);
        },
        [
            started,
            deleteModeActive,
            saveModalIsOpen,
            usingMidi,
            presetButtons,
            setStyle,
            dispatch,
            figureOn,
        ]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return <>{children}</>;
};

export default KeyListenerWrapper;

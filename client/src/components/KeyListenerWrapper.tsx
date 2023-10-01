import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { artScrollerActions } from "../store/artScrollerSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { ledActions } from "../store/ledSlice";
import { IPresetButton } from "../types";
import { getGlobalState } from "../store/store";
import { keyboardActions } from "../store/keyboardSlice";
import { KeyInputName } from "../utils/KeyMappingClass";

const KeyListenerWrapper: React.FC = ({ children }): JSX.Element => {
    const dispatch = useDispatch();
    const { deleteModeActive, presetButtons, saveModalIsOpen, figureOn, keyMapEditMode, isListeningForKeyMappingEdit } =
        getGlobalState(useSelector);

    const setStyle = useCallback(
        (preset: IPresetButton): void => {
            dispatch(ledActions.setPresetName(preset.presetName));
            dispatch(
                presetButtonsListActions.checkPresetButtonsActive({
                    id: preset.id,
                })
            );
            dispatch(ledActions.setAnimVarCoeff(preset.animVarCoeff));
        },
        [dispatch]
    );

    const handleKeyPress = useCallback(
        (event: KeyboardEvent): void => {
            if (deleteModeActive) return;
            if (saveModalIsOpen) return;

            if (keyMapEditMode && isListeningForKeyMappingEdit) {
                // update key mapping for the ey that was just pressed
                dispatch(keyboardActions.updateKeyMapping(event.key as KeyInputName));
            }

            //clear led screen
            // TODO: change the LED styles to still have the dimensions of being empty but no color as to not remove the dimensional grid from the DOM
            if (event.key === "c" || event.key === "C") {
                dispatch(ledActions.setPresetName(""));
                dispatch(presetButtonsListActions.setAllInactive());
            }

            if (event.key === "b" || event.key === "B") {
                dispatch(artScrollerActions.setFigureOn(figureOn ? false : true));
            }

            const preset = presetButtons.filter((btn) => btn.keyBinding === event.key)[0] as IPresetButton;

            if (!preset) return;

            setStyle(preset);
        },
        [
            deleteModeActive,
            saveModalIsOpen,
            presetButtons,
            setStyle,
            dispatch,
            figureOn,
            keyMapEditMode,
            isListeningForKeyMappingEdit,
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

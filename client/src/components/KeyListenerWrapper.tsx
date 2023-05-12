import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { artScrollerActions } from "../reducers/artScrollerSlice";
import { presetButtonsListActions } from "../reducers/presetButtonListSlice";
import { ledActions } from "../reducers/ledSlice";
import { IPresetButton } from "../types";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { getGlobalState } from "../reducers/store";

const KeyListenerWrapper: React.FC = ({ children }): JSX.Element => {
    const dispatch = useDispatch();
    const { deleteModeActive, presetButtons, saveModalIsOpen, figureOn } =
        getGlobalState(useSelector);

    const setStyle = useCallback(
        (preset: IPresetButton): void => {
            dispatch(ledActions.setPresetName(preset.presetName));
            dispatch(
                presetButtonsListActions.checkPresetButtonsActive({
                    buttons: presetButtons,
                    id: preset.id,
                })
            );
            dispatch(ledActions.setAnimVarCoeff(preset.animVarCoeff));
            dispatch(
                ledActions.setLedStyle(
                    new LedStyleEngine(preset.presetName).createStyleSheet(preset.animVarCoeff)
                )
            );
        },
        [dispatch, presetButtons]
    );

    const handleKeyPress = useCallback(
        (event: KeyboardEvent): void => {
            if (deleteModeActive) return;
            if (saveModalIsOpen) return;

            //clear led screen
            // TODO: change the LED styles to still have the dimensions of being empty but no color as to not remove the dimensional grid from the DOM
            if (event.key === "c" || event.key === "C") {
                dispatch(ledActions.setPresetName(""));
                dispatch(ledActions.clearStyle());
                dispatch(presetButtonsListActions.setAllInactive(presetButtons));
            }

            if (event.key === "b" || event.key === "B") {
                dispatch(artScrollerActions.setFigureOn(figureOn ? false : true));
            }

            const preset = presetButtons.filter(
                (btn) => btn.keyBinding === event.key
            )[0] as IPresetButton;

            if (!preset) return;

            setStyle(preset);
        },
        [deleteModeActive, saveModalIsOpen, presetButtons, setStyle, dispatch, figureOn]
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

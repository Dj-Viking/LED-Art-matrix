import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animVarCoeffChange, presetSwitch } from "../actions/led-actions";
import { checkPresetButtonsActive } from "../actions/preset-button-actions";
import { setLedStyle } from "../actions/style-actions";
import { IPresetButton, MyRootState } from "../types";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";


const KeyListenerWrapper: React.FC = ({ children }): JSX.Element => {
  const dispatch = useDispatch();
  const { deleteModeActive } = useSelector((state: MyRootState) => state.deleteModalState);
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
  const { saveModalIsOpen } = useSelector((state: MyRootState) => state.saveModalState);

  const setStyle = useCallback((preset: IPresetButton): void => {
    dispatch(presetSwitch(preset.presetName));
    dispatch(checkPresetButtonsActive(presetButtons, preset.id));
    dispatch(animVarCoeffChange(preset.animVarCoeff));
    dispatch(setLedStyle(new LedStyleEngine(preset.presetName).createStyleSheet(preset.animVarCoeff)));
  }, [dispatch, presetButtons]);
  
  const handleKeyPress = useCallback((event: KeyboardEvent): void => {
    if (deleteModeActive) return;
    if (saveModalIsOpen) return;

    // console.log("event key", event.key);

    const preset = presetButtons.filter(btn => btn.keyBinding === event.key)[0] as IPresetButton;
    if (!preset) return;
    setStyle(preset);

  }, [deleteModeActive, saveModalIsOpen, presetButtons, setStyle]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  
  return (
    <>
      {children}
    </>
  );
};

export default KeyListenerWrapper;
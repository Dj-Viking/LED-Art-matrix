import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFigureOn } from "../actions/art-scroller-actions";
import { animVarCoeffChange, presetSwitch } from "../actions/led-actions";
import { checkPresetButtonsActive, setAllInactive } from "../actions/preset-button-actions";
import { clearStyle, setLedStyle } from "../actions/style-actions";
import { IPresetButton, MyRootState } from "../types";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";

const KeyListenerWrapper: React.FC = ({ children }): JSX.Element => {
  
  const dispatch = useDispatch();
  const { deleteModeActive } = useSelector((state: MyRootState) => state.deleteModalState);
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
  const { saveModalIsOpen } = useSelector((state: MyRootState) => state.saveModalState);
  const { figureOn } = useSelector((state: MyRootState) => state.artScrollerState);

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

    //clear led screen
    // TODO: change the LED styles to still have the dimensions of being empty but no color as to not remove the dimensional grid from the DOM
    if (event.key === "c" || event.key === "C") {
      dispatch(presetSwitch(""));
      dispatch(clearStyle());
      dispatch(setAllInactive(presetButtons));
    }

    if (event.key === "b" || event.key === "B") {
      dispatch(setFigureOn(figureOn ? false : true));
    }

    const preset = presetButtons.filter(btn => btn.keyBinding === event.key)[0] as IPresetButton;
    if (!preset) return;
    setStyle(preset);

  }, [deleteModeActive, saveModalIsOpen, presetButtons, setStyle, dispatch, figureOn]);

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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { animVarCoeffChange, presetSwitch } from "../actions/led-actions";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { setLedStyle } from "../actions/style-actions";
import { checkPresetButtonsActive } from "../actions/preset-button-actions";
import { MyRootState } from "../types";
import { setDeleteModalOpen, setDeleteModalContext } from "../actions/delete-modal-actions";
import { KeyIcon } from "./KeyIcon";

interface PresetButtonProps {
  button: {
    id: string;
    role: string;
    presetName: string;
    keyBinding: string;
    displayName: string;
    animVarCoeff: string;
    isActive: boolean;
    testid: string;
    classList?: string;
    clickHandler: React.MouseEventHandler<HTMLElement>
  }
}

const PresetButton: React.FC<PresetButtonProps> = ({
  button
}) => {
  const { 
    id, 
    role, 
    presetName, 
    displayName, 
    animVarCoeff, 
    testid, 
    isActive, 
    clickHandler, 
    keyBinding 
  } = button;
  const dispatch = useDispatch();
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
  const { deleteModeActive } = useSelector((state: MyRootState) => state.deleteModalState);


  function setStyle(preset: string): void {
    const LedEngine = new LedStyleEngine(preset);
    const styleHTML = LedEngine.createStyleSheet(animVarCoeff);
    dispatch(animVarCoeffChange(animVarCoeff));
    dispatch(setLedStyle(styleHTML));
  }

  // @ts-ignore
  function determineStyle(isActive: boolean, deleteModeActive: boolean): string {
    switch(true) {
      case isActive && !deleteModeActive: {
        return "preset-button-active";
      }
      case !isActive && !deleteModeActive: {
        return "preset-button-inactive";
      }
      case !isActive && deleteModeActive: {
        return "preset-delete-mode";
      }
      case isActive && deleteModeActive: {
        return "preset-delete-mode";
      }
    }
  }

  return (
    <>
      <button
        tabIndex={-1}
        id={id}
        data-testid={testid}
        role={role}
        className={determineStyle(isActive, deleteModeActive)}
        onClick={(event: any) => {
          clickHandler(event);
          if (!deleteModeActive) {
            dispatch(checkPresetButtonsActive(presetButtons, id));
            dispatch(presetSwitch(presetName));
            setStyle(presetName);
          } else {
            console.log("event target", event);
            dispatch(setDeleteModalOpen(true));
            dispatch(setDeleteModalContext({ btnId: id, displayName }));
          }
        }}
      > 
      {/* TODO: make display none if the screen is mobile, check user agent? or just media query??*/}
        <KeyIcon type={keyBinding}/>
        <p style={{ margin: 0 }}>
          {displayName}
        </p>
          
      </button>
    </>
  );
};


export default PresetButton;
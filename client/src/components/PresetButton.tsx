/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { presetSwitch } from "../actions/led-actions";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { setLedStyle } from "../actions/style-actions";
import { checkPresetButtonsActive } from "../actions/preset-button-actions";
import { MyRootState } from "../types";
import { setDeleteModalOpen, setDeleteModalContext } from "../actions/modal-actions";

interface PresetButtonProps {
  button: {
    id: string;
    role: string;
    presetName: string;
    deleteMode: boolean;
    isActive: boolean;
    testid: string;
    classList?: string;
    clickHandler: React.MouseEventHandler<HTMLElement>
  }
}

const PresetButton: React.FC<PresetButtonProps> = ({
  button
}) => {
  
  const { id, role, presetName, testid, isActive, deleteMode, clickHandler } = button;
  const dispatch = useDispatch();
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);


  function setStyle(preset: string): void {
    const LedEngine = new LedStyleEngine(preset);
    const styleHTML = LedEngine.createStyleSheet("64");
    dispatch(setLedStyle(styleHTML));
  }

  return (
    <>
      <button
        id={id}
        data-testid={testid}
        role={role}
        className={
          ((isActive: boolean, deleteMode: boolean) => {
            
            switch(true) {
              case isActive && !deleteMode: {
                return "preset-button-active";
              }
              case !isActive && !deleteMode: {
                return "preset-button-inactive";
              }
              case !isActive && deleteMode: {
                return "preset-delete-mode";
              }
              default: return "preset-button-inactive";
            }

          })(isActive, deleteMode)
        }

        onClick={(event: any) =>{
          clickHandler(event);
          // TODO: handler for deleting the preset if it was in delete mode
          if (!deleteMode) {
            dispatch(checkPresetButtonsActive(presetButtons, event.target.id));
            dispatch(presetSwitch(presetName));
            setStyle(presetName);
          } else 
            dispatch(setDeleteModalOpen(true));
            dispatch(setDeleteModalContext({ btnId: event.target.id }));
        }}
      >
        {presetName}
      </button>
    </>
  );
};


export default PresetButton;
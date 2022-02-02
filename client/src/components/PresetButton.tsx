/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { escape } from "he";
import { useDispatch, useSelector } from "react-redux";
import { presetSwitch } from "../actions/led-actions";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { setLedStyle } from "../actions/style-actions";
import { checkPresetButtonsActive } from "../actions/preset-button-actions";
import { MyRootState } from "../types";

interface PresetButtonProps {
  button: {
    id: string;
    role: string;
    presetName: string;
    isActive: boolean;
    testid: string;
    classList?: string;
    clickHandler: React.MouseEventHandler<HTMLElement>
  }
}

const PresetButton: React.FC<PresetButtonProps> = ({
  button
}) => {
  const { id, role, presetName, testid, isActive, clickHandler } = button;
  const dispatch = useDispatch();
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
  function setStyle(preset: string): void {
    const LedEngine = new LedStyleEngine(preset);
    const styleHTML = LedEngine.createStyleSheet();
    dispatch(setLedStyle(styleHTML));
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: escape(`
        .preset-button {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          border-radius: 10px;
          height: 50px;
          width: 100px;
          text-align: center;
          color: white;
          background-color: black;
          cursor: pointer;
        }
        .preset-button-active {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          border-radius: 10px;
          height: 50px;
          width: 100px;
          text-align: center;
          color: white;
          background-color: green;
          cursor: pointer;
        }

        .preset-button-inactive {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          height: 50px;
          width: 100px;
          border-radius: 10px;
          background-color: black;
          text-align: center;
          cursor: pointer;
        }
      `)}}></style>

      <button
        id={id}
        style={{}}
        data-testid={testid}
        role={role}
        className={isActive ? "preset-button-active" : "preset-button-inactive"}
        onClick={(event: any) =>{
          clickHandler(event);
          dispatch(checkPresetButtonsActive(presetButtons, event.target.id));
          dispatch(presetSwitch(presetName));
          setStyle(presetName);
        }}
      >
        {presetName}
      </button>
    </>
  );
};


export default PresetButton;
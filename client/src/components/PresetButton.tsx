/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { animated, useSpring } from "react-spring";
import { escape } from "he";
import { useDispatch } from "react-redux";
import { presetSwitch } from "../actions/led-actions";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { setLedStyle } from "../actions/style-actions";

interface PresetButtonProps {
  button: {
    id: string;
    role: string;
    presetName: string;
    testid: string;
    disabled: boolean;
    classList?: string;
    clickHandler: React.MouseEventHandler<HTMLElement>
  }
}

const PresetButton: React.FC<PresetButtonProps> = ({
  button
}) => {
  const { id, role, presetName, testid, disabled, classList, clickHandler } = button;
  const dispatch = useDispatch();
  const presetButtonSpring = useSpring({
    delay: 0,
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    }
  });

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

      <animated.button
        id={id}
        style={presetButtonSpring}
        data-testid={testid}
        role={role}
        className={classList}
        disabled={disabled}
        onClick={(event) =>{
          clickHandler(event);
          dispatch(presetSwitch(presetName));
          setStyle(presetName);
        }}
      >
        {presetName}
      </animated.button>
    </>
  );
};


export default PresetButton;
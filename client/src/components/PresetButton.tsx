import React from "react";
import { animated, useSpring } from "react-spring";
import { escape } from "he";

interface PresetButtonProps {
  button: {
    role: string;
    isActive: boolean;
    title: string;
    testid: string;
    disabled: () => boolean;
    makeClass: () => string;
    clickHandler: React.MouseEventHandler<HTMLElement>
  }
}

const PresetButton: React.FC<PresetButtonProps> = ({
  button
}) => {
  const { isActive, role, title, testid, disabled, makeClass, clickHandler } = button;
  const presetButtonSpring = useSpring({
    delay: 0,
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    }
  });
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: escape(`
        ${
          isActive
          ? `
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
          ` : `
            .preset-button-disabled {
              margin-left: 5px;
              margin-right: 5px;
              margin-bottom: 10px;
              height: 50px;
              width: 100px;
              border-radius: 10px;
              text-align: center;
              cursor: default;
            }
          `
        }
      `)}}></style>
      <animated.button
        style={presetButtonSpring}
        data-testid={testid}
        role={role}
        className={makeClass()}
        disabled={disabled()}
        onClick={clickHandler}
      >
        {title}
      </animated.button>
    </>
  );
};


export default PresetButton;
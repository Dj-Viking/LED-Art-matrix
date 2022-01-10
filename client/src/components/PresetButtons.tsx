import React from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { createMyStyleTag } from "../utils/createMyStyleTag";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring,
  _dm5ButtonSpring
} from "./SpringButtons";
import Auth from "../utils/auth";
import API from "../utils/ApiService";
import { presetSwitch } from "../actions/led-actions";
import { getPresetFromDom } from "../utils/getPresetFromDom";

const PresetButtons: React.FC<any> = (): JSX.Element => {
  const V2ButtonSpring = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring = useSpring(_wavesButtonSpring);
  const spiralButtonSpring = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const dm5ButtonSpring = useSpring(_dm5ButtonSpring);
  const saveButtonSpring = useSpring(_saveButtonSpring);
  const dispatch = useDispatch();
  
  let LedEngine = new LedStyleEngine("");
  let styleTag = createMyStyleTag();

  function setStyle(preset: string): void {
    if (document.querySelector("#led-style")) {
      LedEngine.removeStyle(document.querySelector("#led-style") as HTMLStyleElement);
    }
    LedEngine = new LedStyleEngine(preset);
    styleTag = LedEngine.generateStyle(styleTag);
    LedEngine.appendStyle(styleTag);
  }

  async function handleSaveDefault(event: any): Promise<void> {
    event.preventDefault();
    event.persist();
    // get the classname string split from the classname of one of the led's being displayed
    const presetString = getPresetFromDom(event.target);

    console.log("preset string", presetString);
    await API.updateDefaultPreset({ name: presetString, token: Auth.getToken() as string });
  }
  return (
    <>
      <div
        className="preset-button-container"
        // style={{
        //   display: 'flex',
        // }}
      >
        <animated.button
          style={rainbowButtonSpring}
          className="preset-button rainbow-anim"
          onClick={() => {
            dispatch(presetSwitch("rainbowTestAllAnim"));
            setTimeout(() => {
              document.querySelector("#led-box")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
            setStyle("rainbowTestAllAnim");
          }}
        >
          <span
            className="preset-button-text"
          >
            rainbowTest
          </span>
        </animated.button>
        <animated.button
          style={V2ButtonSpring}
          className="preset-button"
          onClick={() => {
            dispatch(presetSwitch("V2"));
            setStyle("V2");
          }}
        >
          <span
            className="preset-button-text"
            style={{ width: "100%" }}
          >
            V2
          </span>
        </animated.button>
        <animated.button
          style={wavesButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("waves"));
            setStyle("waves");
          }}
        >
          <span
            className="preset-button-text"
          >
            waves
          </span>
        </animated.button>
        <animated.button
          style={spiralButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("spiral"));
            setStyle("spiral");
          }}
        >
          <span
            className="preset-button-text"
          >
            spiral
          </span>
        </animated.button>
        <animated.button
          style={fourSpiralsButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("fourSpirals"));
            setStyle("fourSpirals");
          }}
        >
          <span
            className="preset-button-text"
          >
            fourSpirals
          </span>
        </animated.button>
        <animated.button
          style={dm5ButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("dm5"));
            setStyle("dm5");
          }}
        >
          <span
            className="preset-button-text"
          >
            DM5
          </span>
        </animated.button>

        {/* save as new login preset */}
        <animated.button
          style={saveButtonSpring}
          className={Auth.loggedIn() ? "preset-button save-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={handleSaveDefault}
        >
          Save as Default
        </animated.button>
      </div>
    </>
  );
};

export default PresetButtons;
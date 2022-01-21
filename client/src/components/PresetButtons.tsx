import React from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring,
  _dm5ButtonSpring,
  _clear
} from "./SpringButtons";
import { AuthService as Auth } from "../utils/AuthService";
import API from "../utils/ApiService";
import { presetSwitch } from "../actions/led-actions";
import { clearStyle, setLedStyle } from "../actions/style-actions";
import { getPresetFromDom } from "../utils/getPresetFromDom";

const PresetButtons: React.FC<any> = (): JSX.Element => {
  const V2ButtonSpring = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring = useSpring(_wavesButtonSpring);
  const spiralButtonSpring = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const dm5ButtonSpring = useSpring(_dm5ButtonSpring);
  const saveButtonSpring = useSpring(_saveButtonSpring);
  const clear = useSpring(_clear);
  const dispatch = useDispatch();
  
  let LedEngine = new LedStyleEngine("");

  function setStyle(preset: string): void {
    LedEngine = new LedStyleEngine(preset);
    const styleHTML = LedEngine.createStyleSheet();
    dispatch(setLedStyle(styleHTML));
  }

  async function handleSaveDefault(event: any): Promise<void> {
    event.preventDefault();
    event.persist();
    // get the classname string split from the classname of one of the led's being displayed
    const presetString = getPresetFromDom(event.target);

    await API.updateDefaultPreset({ name: presetString, token: Auth.getToken() as string });
  }
  return (
    <>
      <span 
        style={{
          color: "white",
          textAlign: "center"
        }}
      >
        LED Matrix Presets
      </span>
      {
        !Auth.loggedIn()
        && (
          <>
            <span
              style={{
                color: "white"
              }}
            >
              To see the Disabled Presets, Log in or Sign up to use those and also save your own Default login Preset!
            </span>
          </>
        )
      }
      <div
        className="preset-button-container"
        // style={{
        //   display: 'flex',
        // }}
      >
        <animated.button
          style={clear}
          role="button"
          data-testid="clear"
          className="preset-button"
          onClick={() => {
            dispatch(presetSwitch(""));
            dispatch(clearStyle());
          }}
        >
          clear
        </animated.button>
        
        <animated.button
          style={rainbowButtonSpring}
          role="button"
          data-testid="rainbowTest"
          className="preset-button rainbow-anim"
          onClick={() => {
            dispatch(presetSwitch("rainbowTestAllAnim"));
            setStyle("rainbowTestAllAnim");
          }}
        >
          rainbowTest
        </animated.button>

        <animated.button
          role="button"
          data-testid="v2"
          style={V2ButtonSpring}
          className="preset-button"
          onClick={() => {
            dispatch(presetSwitch("V2"));
            setStyle("V2");
          }}
        >
          V2
        </animated.button>

        <animated.button
          role="button"
          data-testid="waves"
          style={wavesButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("waves"));
            setStyle("waves");
          }}
        >
          waves
        </animated.button>

        <animated.button
          role="button"
          data-testid="spiral"
          style={spiralButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("spiral"));
            setStyle("spiral");
          }}
        >
          spiral
        </animated.button>

        <animated.button
          role="button"
          data-testid="fourSpirals"
          style={fourSpiralsButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("fourSpirals"));
            setStyle("fourSpirals");
          }}
        >
          fourSpirals
        </animated.button>

        <animated.button
          role="button"
          data-testid="dm5"
          style={dm5ButtonSpring}
          className={Auth.loggedIn() ? "preset-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={() => {
            dispatch(presetSwitch("dm5"));
            setStyle("dm5");
          }}
        >
            DM5
        </animated.button>

        {/* save as new login preset */}
        <animated.button
          role="button"
          data-testid="saveDefault"
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
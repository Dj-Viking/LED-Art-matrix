import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import PresetButton from "./PresetButton";
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring,
  _dm5ButtonSpring,
  _clear,
  _saveNewPresetButtonSpring
} from "./SpringButtons";
import { AuthService as Auth } from "../utils/AuthService";
import API from "../utils/ApiService";
import { presetSwitch } from "../actions/led-actions";
import { clearStyle, setLedStyle } from "../actions/style-actions";
import { MyRootState } from "../types";
import Modal from "./Modal/ModalBase";
import SavePresetModalContent from "./Modal/SavePresetModal";

const PresetButtons: React.FC<any> = (): JSX.Element => {
  const V2ButtonSpring = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring = useSpring(_wavesButtonSpring);
  const spiralButtonSpring = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const dm5ButtonSpring = useSpring(_dm5ButtonSpring);
  
  const saveButtonSpring = useSpring(_saveButtonSpring);
  const saveNewPresetButtonSpring = useSpring(_saveNewPresetButtonSpring);
  const clear = useSpring(_clear);
  
  const dispatch = useDispatch();
  const { presetName, animVarCoeff } = useSelector((state: MyRootState) => state.ledState);
  
  let LedEngine = new LedStyleEngine("");

  function setStyle(preset: string): void {
    LedEngine = new LedStyleEngine(preset);
    const styleHTML = LedEngine.createStyleSheet();
    dispatch(setLedStyle(styleHTML));
  }

  // TODO: load buttons dynamically according to the account logged in.
  // have the starting buttons there, but when a new preset is being created
  // with new parameters, we could save that preset with those coefficient parameters
  // as a new button, and a new preset in the user's database model. 

  async function handleSaveDefault(event: any): Promise<void> {
    event.preventDefault();
    await API.updateDefaultPreset({ name: presetName, token: Auth.getToken() as string });
  }

  const [modalOpen, setModalOpen ] = useState<boolean>(false);
  function openSavePresetModal(event: any): void {
    event.preventDefault();
    //open modal, set modal display true
    setModalOpen(true);
  }

  // const [presetActive, setPresetActive] = useState<boolean>(false);
  // function toggleActive (event: any): void {
  //   event.preventDefault();
  //   setPresetActive(true);
  // }


  //TODO: EXTRACT TO OWN COMPONENT DONE

  // TODO: create global buttonList state to keep track of all presets that are active
  // so that we can show which preset is currently active 
  // dynamically load the buttons (some are default) from the user's account
  // in which the button pertains to a custom preset the user made themselves
  // presetState: Array<PresetButtonProps>
  const presetButtons = [
    {
      role: "button",
      key: (Math.random() * 1000).toString() + "kdjfkdjfkdjfkdj",
      isActive: false,
      title: "waves",
      testid: "waves-test",
      disabled: () => !Auth.loggedIn(),
      makeClass: (): string => {
        if (Auth.loggedIn()) {
          return "preset-button";
        } else return "preset-button-disabled";
      },
      clickHandler: (event: any) => {
        event.preventDefault();
        dispatch(presetSwitch("waves"));
        setStyle("waves");
      }
    }
  ];

  return (
    <>
    {
      Array.isArray(presetButtons) && presetButtons.map(button => {
        return (
          <PresetButton key={button.key} button={{ ...button }} />
        );
      })
    }
      <Modal isOpen={modalOpen}>
        <SavePresetModalContent
          context={{
            animVarCoeff
          }} 
          onClose={(event) => {
            event.preventDefault();
            setModalOpen(false);
          }}
        />
      </Modal>
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
      <div className="preset-button-container">
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

        <animated.button
          role="button"
          data-testid="savePreset"
          style={saveNewPresetButtonSpring}
          className={Auth.loggedIn() ? "preset-button save-button" : "preset-button-disabled"}
          disabled={!Auth.loggedIn()}// enable if logged in
          onClick={openSavePresetModal}
        >
          Save as new Preset
        </animated.button>
      </div>
    </>
  );
};

export default PresetButtons;
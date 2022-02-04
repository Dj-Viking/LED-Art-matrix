/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import PresetButton from "./PresetButton";
import { 
  _saveButtonSpring,
  _clear,
  _saveNewPresetButtonSpring
} from "./SpringButtons";
import { AuthService as Auth } from "../utils/AuthService";
import API from "../utils/ApiService";
import { presetSwitch } from "../actions/led-actions";
import { clearStyle } from "../actions/style-actions";
import { IPresetButton, MyRootState } from "../types";
import Modal from "./Modal/ModalBase";
import SavePresetModalContent from "./Modal/SavePresetModal";
import { checkPresetButtonsActive, setAllInactive, setPresetButtonsList } from "../actions/preset-button-actions";
import { IDBPreset, PresetButtonsList } from "../utils/PresetButtonsListClass";
import PresetButtonStyles from "./StyleTags/PresetButtonStyles";

const PresetButtons: React.FC<any> = (): JSX.Element => {
  
  const saveButtonSpring = useSpring(_saveButtonSpring);
  const saveNewPresetButtonSpring = useSpring(_saveNewPresetButtonSpring);
  const clear = useSpring(_clear);
  
  const dispatch = useDispatch();
  const { presetName, animVarCoeff } = useSelector((state: MyRootState) => state.ledState);
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);

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

  const getPresets = useCallback(async (): Promise<IDBPreset[] | void> => {
    try {
      const presets = await API.getUserPresets(Auth.getToken() as string);
      if (Array.isArray(presets)) return presets;
    } catch (error) {
      console.error("error when fetching for user's presets", error);
    }
  }, []);

  useEffect(() => {
    if (presetButtons.length === 0) {

      if (!Auth.loggedIn()) {
        const presetNames = ["rainbowTest", "v2", "waves", "spiral", "fourSpirals", "dm5"];
    
        const tempPresets = presetNames.map(name => {
          return {
            _id: (Math.random() * 1000).toString() + "kdjfkdjfkjd",
            presetName: name,
          } as IDBPreset;
        });
    
        const tempButtons = new PresetButtonsList((event: any) => {
          event.preventDefault();
          dispatch(checkPresetButtonsActive(presetButtons, event.target.id));
        }, tempPresets).getList();
    
        dispatch(setPresetButtonsList(tempButtons));
      } else {
        (async (): Promise<void> => {
          let presets = await getPresets() as IDBPreset[];
          
          const buttons = new PresetButtonsList(
            (event: any) => {//click handler
              event.preventDefault();
              dispatch(checkPresetButtonsActive(presetButtons, event.target.id));
            }, presets
          ).getList() as IPresetButton[];
    
          dispatch(setPresetButtonsList(buttons));
        })();
      }
    }

    return void 0;

  }, [dispatch, getPresets, presetButtons.length]);

  return (
    <>
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
            dispatch(setAllInactive(presetButtons));
          }}
        >
          clear
        </animated.button>

        <div data-testid="buttons-parent">
          <PresetButtonStyles />
        {
          Array.isArray(presetButtons) && presetButtons.map(button => {
            return (
              <PresetButton
                key={button.key} 
                button={{ ...button }}
              />
            );
          })
        }
        </div>

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
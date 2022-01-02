//IMPORT REACT
import React, { useEffect, useCallback, useState } from 'react';

//REACT SPRING
import { useSpring, animated } from 'react-spring';
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring,
  _dm5ButtonSpring
} from "../SpringButtons";

//STYLES
import './ledLayoutStyle.css'

import { 
  appendStyle, 
  removeStyle,
  ledRowStyle,
  rainbowTest,
  rainbowV2,
  waves,
  spiral,
  fourSpirals,
  dm5
} from './ledStyles';

//COMPONENTS
import ArtScroller from '../ArtScroller';


//maybe disable some "paid presets?"

//future thought to translate the presets into DMX controls.

//or control the LEDs on the web app with MIDI or DMX

//AUTH
import Auth from '../../utils/auth.js';
import API from "../../utils/ApiService";

//REDUX
import {useSelector, useDispatch} from 'react-redux';

//ACTIONS
import { 
  presetSwitch,
} from '../../actions/led-actions';

const BigLedBox = () => {
  const V2ButtonSpring          = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring     = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring       = useSpring(_wavesButtonSpring);
  const spiralButtonSpring      = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const dm5ButtonSpring         = useSpring(_dm5ButtonSpring);
  const saveButtonSpring        = useSpring(_saveButtonSpring); 

  //did request preset state
  const [didRequestPreset, setDidRequestPreset] = useState(false);

  let styleTag = document.createElement("style");
  styleTag.setAttribute("id", "led-style");


  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
   //REDUX GLOBAL STATE
   const ledChangeState = useSelector(state => state.ledChange);
   //console.log(ledChangeState);
 
   //REDUX piece of global state
   const {
     presetName,
   } = ledChangeState;

  /**
   * @returns {Promise<string>}
   */
  const getDefaultPreset = useCallback(async () => {
    setDidRequestPreset(true);
    try {
      const preset = await API.getDefaultPreset(Auth.getToken());
      if (typeof preset === "string") {
        return preset;
      }
      else throw new TypeError(`preset returned was not a string! it's value was ${preset}`);
    } catch (error) {
      console.error("error when getting default preset in use callback", error);
    }
  }, []);

  //function that sets the starting preset name of the user logging on
  // conditionally render whether they are logged on => load with that default preset
  // : else load the blank preset name
  useEffect(() => {
    async function awaitThePresetCallback() {
      if (Auth.loggedIn()) {
        const preset = await getDefaultPreset();
        if (typeof preset === "string") {
          if (preset === "") {
            setRainbowStyle();
          }
          if (preset === "V2") {
            setRainbowV2Style();
          }
          if (preset === "waves") {
            setWavesStyle();
          }
          if (preset === "spiral") {
            setSpiralStyle();
          }
          if (preset === "fourSpirals") {
            setFourSpiralsStyle();
          }
          if (preset === "dm5") {
            setdm5Style();
          }
          dispatchREDUX(presetSwitch(preset));
        }
      }
    }
    awaitThePresetCallback();
    return void 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDefaultPreset, didRequestPreset, dispatchREDUX]);
  
 
  
  /**
   * array of led objects that only contain the information needed
   * use .map() in react to create elements with unique keys
   * react needs key properties on JSX in order to clean up during
   * mounting and unmounting elements
   */
  //eslint-disable-next-line
  let leds_info;
  /**
   * @type {Array<{ledNumber: number}>}
   */
  const leds = [];
  /**
   * 
   * @param {number} num 
   * @returns {void}
   */
  function createLedObjectsArray(num) {
    for (let i = 1; i < num; i++) 
      leds.push({ ledNumber: i, });
  }

  /**
   * array of row objects only containing information for
   * react to use .map() and make unique keys for the
   * JSX elements and contain a horizontal rows of leds
   * in each row the nested .map() is inserting all 32 leds
   * into a single rows.map() iteration.
   */
  // eslint-disable-next-line
  let rows_info;
  /**
   * @type {Array<{rowNumber: number}>}
   */
  const rows = [];
  /**
   * 
   * @param {number} num 
   * @returns {void}
   */
  function createLedRowsArray(num) {
    for (let i = 1; i < num; i++) 
      rows.push({ rowNumber: i });
  }

  async function handleSaveDefault(event) {
    event.preventDefault();
    event.persist();
    // get the classname string split from the classname of one of the led's being displayed
    let presetString = 
      event
      .target
        .parentElement
          .parentElement
            .parentElement
              .children[1]
                .firstChild
                  .firstChild
                  .className
                  .split('led1-1')[1];

    console.log("preset string", presetString);
    await API.updateDefaultPreset({ name: presetString, token: Auth.getToken() });
  }

  createLedObjectsArray(33);
  createLedRowsArray(33);

  function setRainbowStyle() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = rainbowTest(styleTag);
    appendStyle(styleTag);
  }
  function setRainbowV2Style() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = rainbowV2(styleTag);
    appendStyle(styleTag);
  }
  function setWavesStyle() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = waves(styleTag);
    appendStyle(styleTag);
  }
  function setSpiralStyle() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = spiral(styleTag);
    appendStyle(styleTag);
  }
  function setFourSpiralsStyle() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = fourSpirals(styleTag);
    appendStyle(styleTag);
  }
  function setdm5Style() {
    if (document.querySelector("#led-style")) {
      removeStyle(document.querySelector("#led-style"));
    }
    styleTag = dm5(styleTag);
    appendStyle(styleTag);
  }
  
  return (
    <>
      <main className="box-style">
        <section 
          style={{
            position: 'relative',
            display: 'flex',
            textAlign: 'center',
            flexDirection: 'column'
          }}
        >
          <ArtScroller />
          <div className="border-top-led"></div>
          <span 
            style={{
              color: 'white',
              textAlign: 'center'
            }}
          >
            LED Matrix Presets
          </span>
          {
            !Auth.loggedIn()
            &&
            (
              <>
                <span
                  style={{
                    color: 'white'
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
              style={rainbowButtonSpring}
              className="preset-button rainbow-anim"
              onClick={() => {
                dispatchREDUX(presetSwitch(''));
                setTimeout(() => {
                  setRainbowStyle();
                  document.querySelector("#led-box").scrollIntoView({ behavior: "smooth" });
                }, 300);
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
                dispatchREDUX(presetSwitch('V2'))
                setRainbowV2Style();
              }}
            >
              <span
                className="preset-button-text"
                style={{width: '100%'}}
              >
                V2
              </span>
            </animated.button>
            <animated.button
              style={wavesButtonSpring}
              className={Auth.loggedIn() ? `preset-button` : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('waves'))
                setWavesStyle();
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
              className={Auth.loggedIn() ? 'preset-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true }//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('spiral'));
                setSpiralStyle();
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
              className={Auth.loggedIn() ? 'preset-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('fourSpirals'));
                setFourSpiralsStyle();
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
              className={Auth.loggedIn() ? 'preset-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('dm5'));
                setdm5Style();
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
              className={Auth.loggedIn() ? 'preset-button save-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={handleSaveDefault}
            >
              Save as Default
            </animated.button>
          </div>
        </section>
        <section
          id="led-box"
          className="led-matrix-container"
        >
          {
            rows.map((row, index) => (
              <div 
                key={`row${index + 1}`} 
                style={ledRowStyle()}
              >
                {
                  leds.map((led, index) => (
                    <div 
                      key={`led${led.ledNumber}-${index + 1}`} 
                      className={`led${index + 1}-${row.rowNumber}${Auth.loggedIn() ? presetName : presetName}`}
                    >
                    </div>
                  ))
                }
              </div>
            ))
          }
        </section>
      </main>
    </>
  );
};

export default BigLedBox;
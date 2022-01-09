// eslint-disable-next-line
// @ts-ignore
import React, { useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
// import { useSelector, useDispatch } from "react-redux";
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring,
  _dm5ButtonSpring
} from "./SpringButtons";
import "./aux-styles/ledLayoutStyle.css";
import { ledRowStyle } from "./ledStyles";
import ArtScroller from "./ArtScroller";
import Auth from "../utils/auth";
import API from "../utils/ApiService";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";

// ACTIONS
// import { 
//   presetSwitch,
// } from "../actions/led-actions";
// import { MyRootState } from "../types";

const BigLedBox = (): JSX.Element => {
  const V2ButtonSpring = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring = useSpring(_wavesButtonSpring);
  const spiralButtonSpring = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const dm5ButtonSpring = useSpring(_dm5ButtonSpring);
  const saveButtonSpring = useSpring(_saveButtonSpring); 

  // did request preset state
  const [didRequestPreset, setDidRequestPreset] = useState<boolean>(false);

  let ledEngine = new LedStyleEngine("");
  let styleTag = document.createElement("style");
  styleTag.setAttribute("id", "led-style");
  const [presetName, setPresetName] = useState<string | void>(void 0);

  const getDefaultPreset = useCallback(async () => {
    setDidRequestPreset(true);
    try {
      const preset = await API.getDefaultPreset(Auth.getToken() as string);
      if (typeof preset === "string") {
        return preset;
      }
      throw new TypeError(`preset returned was not a string! it's value was ${preset}`);
    } catch (error) {
      console.error("error when getting default preset in use callback", error);
      return void 0;
    }
  }, []);

  // function that sets the starting preset name of the user logging on
  // conditionally render whether they are logged on => load with that default preset
  // : else load the blank preset name
  useEffect(() => {
    async function awaitThePresetCallback(): Promise<void> {
      if (Auth.loggedIn()) {
        const preset = await getDefaultPreset();
        if (typeof preset === "string") {
          setPresetName(preset);
        }
      }
    }
    awaitThePresetCallback();
    return void 0;
  }, [getDefaultPreset, didRequestPreset]);
  
  /**
   * array of led objects that only contain the information needed
   * use .map() in react to create elements with unique keys
   * react needs key properties on JSX in order to clean up during
   * mounting and unmounting elements
   */
  const leds: Array<{ ledNumber: number }> = [];
  function createLedObjectsArray(num: number): void {
    for (let i = 1; i < num; i++) { leds.push({ ledNumber: i, }); }
  }

  /**
   * array of row objects only containing information for
   * react to use .map() and make unique keys for the
   * JSX elements and contain a horizontal rows of leds
   * in each row the nested .map() is inserting all 32 leds
   * into a single rows.map() iteration.
   */
  const rows: Array<{ rowNumber: number; }> = [];
  function createLedRowsArray(num: number): void {
    for (let i = 1; i < num; i++) { rows.push({ rowNumber: i }); }
  }

  async function handleSaveDefault(event: any): Promise<void> {
    event.preventDefault();
    event.persist();
    // get the classname string split from the classname of one of the led's being displayed
    const presetString = event
      .target
        .parentElement
          .parentElement
            .parentElement
              .children[1]
                .firstChild
                  .firstChild
                  .className
                  .split("led1-1")[1];

    console.log("preset string", presetString);
    await API.updateDefaultPreset({ name: presetString, token: Auth.getToken() as string });
  }

  createLedObjectsArray(33);
  createLedRowsArray(33);

  function setStyle(preset: string): void {
    if (document.querySelector("#led-style")) {
      ledEngine.removeStyle(document.querySelector("#led-style") as HTMLStyleElement);
    }
    ledEngine = new LedStyleEngine(preset);
    styleTag = ledEngine.createStyleFunction()(styleTag);
    ledEngine.appendStyle(styleTag);
  }
  
  return (
    <>
      <main className="box-style">
        <section 
          style={{
            position: "relative",
            display: "flex",
            textAlign: "center",
            flexDirection: "column"
          }}
        >
          <ArtScroller />
          <div className="border-top-led" />
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
              style={rainbowButtonSpring}
              className="preset-button rainbow-anim"
              onClick={() => {
                setPresetName("");
                setTimeout(() => {
                  document.querySelector("#led-box")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
                setStyle("");
                // setRainbowStyle();
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
                setPresetName("V2");
                // setRainbowV2Style();
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
                setPresetName("waves");
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
                setPresetName("spiral");
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
                setPresetName("fourSpirals");
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
                setPresetName("dm5");
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
        </section>
        <section
          id="led-box"
          className="led-matrix-container"
        >
          {
            rows.map((row, index) => (
              <div 
                key={`row${index + 1}`}
                // eslint-disable-next-line
                // @ts-ignore
                style={ledRowStyle()}
              >
                {
                  leds.map((led, index) => (
                    <div 
                      key={`led${led.ledNumber}-${index + 1}`} 
                      className={`led${index + 1}-${row.rowNumber}${Auth.loggedIn() ? presetName : presetName}`}
                    />
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

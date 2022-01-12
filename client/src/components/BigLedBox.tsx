import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./aux-styles/ledLayoutStyle.css";
import { ledRowStyle } from "./ledStyles";
import ArtScroller from "./ArtScroller";
import Auth from "../utils/auth";
import API from "../utils/ApiService";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import { createMyStyleTag } from "../utils/createMyStyleTag";
import { presetSwitch } from "../actions/led-actions";
import { MyRootState } from "../types";
import PresetButtons from "./PresetButtons";

const BigLedBox: React.FC = (): JSX.Element => {
  const { presetName } = useSelector((state: MyRootState) => state.ledState);
  const dispatch = useDispatch();
  const LedEngineRef = useRef<LedStyleEngine>(new LedStyleEngine("rainbowTestAllAnim"));
  const styleTagRef = useRef<HTMLStyleElement>(createMyStyleTag());

  const getDefaultPreset = useCallback(async () => {
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
    (async (): Promise<void> => {
      if (Auth.loggedIn()) {
        const preset = await getDefaultPreset();
        if (typeof preset === "string") {
          // set the presetname state for the react element
          dispatch(presetSwitch(preset));
          
          // recreate the styletag with the corresponding animation for the given preset
          // have to use useRef because "React" I guess..I don't get why, it works without useRef but whatever
          LedEngineRef.current = new LedStyleEngine(preset);
          styleTagRef.current = LedEngineRef.current.generateStyle(styleTagRef.current);
          LedEngineRef.current.appendStyle(styleTagRef.current);

          // clean up so we dont append more than one style tag
          // remove the last child 
          const styleTagColl = document.querySelectorAll<HTMLStyleElement>("#led-style");
          if (styleTagColl.length > 1) {
            LedEngineRef.current.removeStyle(styleTagColl[styleTagColl.length - 1]);
          }
        }
      }
    })();
    return void 0;
  }, [getDefaultPreset, dispatch]);

  const leds: Array<{ ledNumber: number }> = [];
  function createLedObjectsArray(num: number): void {
    for (let i = 1; i < num; i++) { leds.push({ ledNumber: i, }); }
  }

  const rows: Array<{ rowNumber: number; }> = [];
  function createLedRowsArray(num: number): void {
    for (let i = 1; i < num; i++) { rows.push({ rowNumber: i }); }
  }

  createLedObjectsArray(33);
  createLedRowsArray(33);
  
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
          <PresetButtons />
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
                      className={`led${index + 1}-${row.rowNumber}${presetName}`}
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

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./aux-styles/ledLayoutStyle.css";
import { ledRowStyle } from "./ledStyles";
import ArtScroller from "./ArtScroller";
import { AuthService as Auth } from "../utils/AuthService";
import API from "../utils/ApiService";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import LedStyleTag from "./LedStyleTag";
import { animVarCoeffChange, presetSwitch } from "../actions/led-actions";
import { MyRootState } from "../types";
import PresetButtons from "./PresetButtons";
import { setLedStyle } from "../actions/style-actions";
import { IDBPreset } from "../utils/PresetButtonsListClass";
import { keyGen } from "../utils/keyGen";


const BigLedBox: React.FC = (): JSX.Element => {
  const { presetName, animVarCoeff } = useSelector((state: MyRootState) => state.ledState);
  const dispatch = useDispatch();
  const LedEngineRef = useRef<LedStyleEngine>(new LedStyleEngine("rainbowTestAllAnim"));
  const styleHTMLRef = useRef<string>("");

  // @ts-ignore
  const getDefaultPreset = useCallback(async () => {
    try {
      const preset = await API.getDefaultPreset(Auth.getToken() as string) as IDBPreset;
      return preset;
      // console.error(`preset returned was not a string! it's value was ${preset}`);
    } catch (error) { }
  }, []);

  // function that sets the starting preset name of the user logging on
  // conditionally render whether they are logged on => load with that default preset
  // : else load the blank preset name
  useEffect(() => {
    (async (): Promise<void> => {
      if (Auth.loggedIn()) {
        const preset = await getDefaultPreset() as IDBPreset;
        if (typeof preset.presetName === "string") {
          dispatch(animVarCoeffChange(preset.animVarCoeff as string));
          dispatch(presetSwitch(preset.presetName));
          LedEngineRef.current = new LedStyleEngine(preset.presetName);
          styleHTMLRef.current = LedEngineRef.current.createStyleSheet(preset.animVarCoeff as string);
          dispatch(setLedStyle(styleHTMLRef.current));
        }
      }
    })();
    return void 0;
  }, [getDefaultPreset, dispatch]);

  //second use effect to re-render when the preset parameters change witht he slider and also when the preset switch happens.
  useEffect(() => {
    styleHTMLRef.current = new LedStyleEngine(presetName).createStyleSheet(animVarCoeff);
    dispatch(setLedStyle(styleHTMLRef.current));
  }, [animVarCoeff, presetName, dispatch]);

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
        <LedStyleTag />
        <section className="controls-container">
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
                  leds.map((led) => (
                    <div
                      data-testid={`led${led.ledNumber}-${row.rowNumber}`}
                      id={`led${led.ledNumber}-${row.rowNumber}`}
                      key={`led${led.ledNumber}-${keyGen()}`}
                      className={`led${led.ledNumber}-${row.rowNumber}${presetName}`}
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

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./aux-styles/ledLayoutStyle.css";
import { ledRowStyle } from "./ledStyles";
import ArtScroller from "./ArtScroller";
import { LedStyleEngine } from "../utils/LedStyleEngineClass";
import LedStyleTag from "./LedStyleTag";
import { ledActions } from "../store/ledSlice";
import PresetButtons from "./PresetButtons";
import { keyGen } from "../utils/keyGen";
import { isLedWindow } from "../App";
import { ToolkitRootState } from "../store/store";

const BigLedBox: React.FC = (): JSX.Element => {
    const { presetName, animVarCoeff } = useSelector((state: ToolkitRootState) => state.ledState);
    const dispatch = useDispatch();
    const styleHTMLRef = useRef<string>("");

    //second use effect to re-render when the preset parameters change witht he slider and also when the preset switch happens.
    useEffect(() => {
        (async () => {
            styleHTMLRef.current = new LedStyleEngine(presetName).createStyleSheet(animVarCoeff);
            dispatch(ledActions.setLedStyle(styleHTMLRef.current));
        })();
    }, [animVarCoeff, presetName, dispatch]);

    const leds: Array<{ ledNumber: number }> = [];
    function createLedObjectsArray(num: number): void {
        for (let i = 1; i < num; i++) {
            leds.push({ ledNumber: i });
        }
    }

    const rows: Array<{ rowNumber: number }> = [];
    function createLedRowsArray(num: number): void {
        for (let i = 1; i < num; i++) {
            rows.push({ rowNumber: i });
        }
    }

    createLedObjectsArray(LedStyleEngine.LED_AMOUNT);
    createLedRowsArray(LedStyleEngine.LED_AMOUNT);

    return (
        <>
            <main>
                <LedStyleTag />
                <section
                    className="controls-container"
                    style={{
                        visibility: isLedWindow() ? "hidden" : "visible",
                        height: isLedWindow() ? "0px" : "auto",
                    }}
                >
                    <ArtScroller />
                    <div className="border-top-led" />
                    <PresetButtons />
                </section>
                <section className={"led-matrix-container-led-window"}>
                    {rows.map((row, index) => (
                        <div
                            key={`row${index + 1}`}
                            // eslint-disable-next-line
                            // @ts-ignore
                            style={ledRowStyle()}
                        >
                            {leds.map((led) => (
                                <div
                                    data-testid={`led${led.ledNumber}-${row.rowNumber}`}
                                    id={`led${led.ledNumber}-${row.rowNumber}`}
                                    key={`led${led.ledNumber}-${keyGen()}`}
                                    className={`led${led.ledNumber}-${row.rowNumber}${presetName}`}
                                />
                            ))}
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
};

export default BigLedBox;

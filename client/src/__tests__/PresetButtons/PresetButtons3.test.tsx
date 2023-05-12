/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../store";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import {
    ASSERT_ANIMATION,
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
    MOCK_SIGN_TOKEN_ARGS,
} from "../../utils/mocks";
import { TestService } from "../../utils/TestServiceClass";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
window.navigator.requestMIDIAccess = async function (): Promise<MIDIAccessRecord> {
    return Promise.resolve({
        inputs: MOCK_ACCESS_INPUTS,
        outputs: MOCK_ACCESS_OUTPUTS,
        sysexEnabled: false,
        onstatechange: function (_event: MIDIConnectionEvent): void {
            return void 0;
        },
    } as MIDIAccessRecord);
};

const store = createStore(
    combinedReducers,
    // @ts-expect-error this will exist in the browser
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const originalFetch = global.fetch;
beforeEach(() => {
    const fakeFetchRes = (
        value: any
    ): Promise<{
        status: 200;
        json: () => Promise<any>;
    }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
    const mockFetch = jest
        .fn()
        //default
        // .mockReturnValue("kdfjkdj")
        // first
        .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
        // second
        .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "" } }));
    // @ts-ignore
    global.fetch = mockFetch;
});

afterEach(() => {
    global.fetch = originalFetch;
    cleanup();
    localStorage.clear();
});

//RAINBOW TEST
it("tests the led styles change to rainbowTest when rainbow button is clicked", async () => {
    localStorage.clear();
    //set test token in storage
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));

    const history = createMemoryHistory();

    const { container } = render(
        <>
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    expect(fetch).toHaveBeenCalledTimes(2);

    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();

    expect(ledPreRef.classList.length).toBe(1);
    expect(ledPreRef.classList[0]).toBe("led1-1");

    const preset_buttons = {
        clear: screen.getByTestId("clear"),
        rainbowTest: await screen.findByTestId("rainbowTest"),
        v2: await screen.findByTestId("v2"),
        waves: await screen.findByTestId("waves"),
        spiral: await screen.findByTestId("spiral"),
        fourSpirals: await screen.findByTestId("fourSpirals"),
        dm5: await screen.findByTestId("dm5"),
        saveDefault: await screen.findByTestId("saveDefault"),
    };

    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();

    let ledPost: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;

    act(() => {
        preset_buttons.rainbowTest.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(preset_buttons.rainbowTest.classList.length).toBe(1);
    expect(preset_buttons.rainbowTest.classList[0]).toBe("preset-button-active");

    ledPost = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPost).toBeInTheDocument();
    expect(ledPost.classList.contains("led1-1rainbowTest")).toBe(true);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText
        .map((str) => {
            if (ASSERT_ANIMATION.rainbowTest.regex.test(str)) {
                return str;
            }
            return void 0;
        })
        .filter((item) => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches
        .map((str) => {
            if (ASSERT_ANIMATION.keyframes.test(str)) {
                return str;
            }
            return void 0;
        })
        .filter((item) => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
        preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // clearLedRef.classList.forEach((value: string, key: number, parent: DOMTokenList) => {
    // console.log("value", value, "key", key, "parent", parent);
    // });
    expect(clearLedRef.classList.contains("led1-1")).toBe(true);
});

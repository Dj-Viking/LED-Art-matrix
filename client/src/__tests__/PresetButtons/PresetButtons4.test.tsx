/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { ASSERT_ANIMATION, MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
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

//V2
it("tests the led styles change to v2 when v2 button is clicked", async () => {
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
    const hiddenHistoryRef = screen.getByTestId("location-display");
    expect(hiddenHistoryRef).toHaveTextContent("/");

    const preset_buttons = {
        clear: screen.getByTestId("clear"),
        rainbowTest: screen.getByTestId("rainbowTest"),
        v2: screen.getByTestId("v2"),
        waves: screen.getByTestId("waves"),
        spiral: screen.getByTestId("spiral"),
        fourSpirals: screen.getByTestId("fourSpirals"),
        dm5: screen.getByTestId("dm5"),
        saveDefault: screen.getByTestId("saveDefault"),
    };

    //get ref to led element and check it's there
    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();

    act(() => {
        fireEvent.click(preset_buttons.clear);
        preset_buttons.clear.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    const ledPost = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPost.classList.length).toBe(1);
    expect(ledPost.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

    expect(preset_buttons.clear).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;

    act(() => {
        preset_buttons.v2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.v2.classListItem);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText
        .map((str) => {
            if (ASSERT_ANIMATION.v2.regex.test(str)) {
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
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);
});

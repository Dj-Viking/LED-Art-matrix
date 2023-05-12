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
    LOGIN_MOCK_TOKEN,
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
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
        .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
        // second
        .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
        // third
        .mockReturnValueOnce(
            fakeFetchRes({
                preset: {
                    displayName: "",
                    presetName: "waves",
                    animVarCoeff: "64",
                    _id: "6200149468fe291e26584e4d",
                },
            })
        );
    // @ts-ignore
    global.fetch = mockFetch;
});

afterEach(() => {
    global.fetch = originalFetch;
    cleanup();
});

it("tests the preset buttons render", async () => {
    const history = createMemoryHistory();

    render(
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
        clear: await screen.findByTestId("clear"),
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

    act(() => {
        preset_buttons.clear.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("led1-1").classList.length).toBe(1);
    expect(screen.getByTestId("led1-1").classList[0]).toBe("led1-1");
});

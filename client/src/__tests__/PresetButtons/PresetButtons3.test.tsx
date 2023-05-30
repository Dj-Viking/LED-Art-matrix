/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import {
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
    MOCK_SIGN_TOKEN_ARGS,
} from "../../utils/mocks";
import { TestService } from "../../utils/TestServiceClass";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { toolkitStore } from "../../store/store";
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

    render(
        <>
            <Provider store={toolkitStore}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    expect(fetch).toHaveBeenCalledTimes(1);

    const preset_buttons = {
        clear: screen.getByTestId("clear"),
        rainbowTest: await screen.findByTestId("rainbowTest"),
        v2: await screen.findByTestId("v2"),
        waves: await screen.findByTestId("waves"),
        spiral: await screen.findByTestId("spiral"),
        dm5: await screen.findByTestId("dm5"),
        saveDefault: await screen.findByTestId("saveDefault"),
    };

    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();
});

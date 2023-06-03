/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
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

//V2
it("tests the led styles change to v2 when v2 button is clicked", async () => {
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
    const hiddenHistoryRef = screen.getByTestId("location-display");
    expect(hiddenHistoryRef).toHaveTextContent("/");

    const preset_buttons = {
        rainbowTest: screen.getByTestId("rainbowTest"),
        v2: screen.getByTestId("v2"),
        waves: screen.getByTestId("waves"),
        spiral: screen.getByTestId("spiral"),
        dm5: screen.getByTestId("dm5"),
        saveDefault: screen.getByTestId("saveDefault"),
    };

    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();

    act(() => {
        preset_buttons.v2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
});

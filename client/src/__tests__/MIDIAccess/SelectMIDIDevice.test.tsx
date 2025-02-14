/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
//@ts-ignore
import React from "react";
import { Provider } from "react-redux";
import { fireEvent, render, screen } from "@testing-library/react";
//@ts-ignore
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { MIDIAccessRecord } from "../../utils/MIDIControlClass";
import { MIDIListenerWrapper } from "../../components/MIDIListenerWrapper";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { MOCK_MIDI_ACCESS_RECORD } from "../../utils/mocks";
import { toolkitStore } from "../../store/store";
import { MIDIInputName } from "../../constants";

// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
global.navigator.requestMIDIAccess = async function (): Promise<MIDIAccessRecord> {
    return Promise.resolve(MOCK_MIDI_ACCESS_RECORD);
};

TestService.createMockMIDIControllerClass();

describe("test selecting midi device toggles which device shows", () => {
    it.skip("select device from dropdown menu", async () => {
        const history = createMemoryHistory();

        render(
            <Provider store={toolkitStore}>
                <Router history={history}>
                    <MIDIListenerWrapper />
                </Router>
            </Provider>
        );

        const select = {
            dropdown: (await screen.findByTestId("midi-select")) as HTMLElement,
            options: (await screen.findAllByTestId("select-option")) as HTMLElement[],
        };

        expect(select.dropdown).toBeInTheDocument();
        expect(select.dropdown).toHaveValue("XONE:K2 MIDI");

        // expect(select.options).toHaveLength(4);

        act(() => {
            fireEvent.change(select.dropdown, { target: { value: "TouchOSC Bridge" as MIDIInputName } });
        });

        expect(select.dropdown).toHaveValue(expect.anything());
    });
});

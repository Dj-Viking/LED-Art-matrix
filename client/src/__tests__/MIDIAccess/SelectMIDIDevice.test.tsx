/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
//@ts-ignore
import React from "react";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { fireEvent, render, screen } from "@testing-library/react";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { MIDIAccessRecord, MIDIController } from "../../utils/MIDIControlClass";
import MIDIListenerWrapper from "../../components/MIDIListenerWrapper";
import { act } from "react-dom/test-utils";
import { keyGen } from "../../utils/keyGen";

const store = createStore(
    allReducers,
    // @ts-expect-error this will exist in the browser
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };
const MOCK_MIDI_ACCESS_RECORD = {
    inputs: MOCK_ACCESS_INPUTS,
    outputs: MOCK_ACCESS_OUTPUTS,
    sysexEnabled: false,
    onstatechange: jest.fn(),
} as MIDIAccessRecord;
// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
global.navigator.requestMIDIAccess = async function (): Promise<MIDIAccessRecord> {
    return Promise.resolve(MOCK_MIDI_ACCESS_RECORD);
};

jest.mock("../../utils/MIDIControlClass.ts", () => {

    const MockMIDIControllerConstructor = function (this: MIDIController): MIDIController {
        //MOCK METHODS AND MEMBER VARIABLES

        const fakeonstatechangefn = (): void => void 0;
        const onstatechangefn = jest.fn().mockImplementation(fakeonstatechangefn);
        // @ts-ignore
        function createFakeInputs(): MIDIInput[] {
            let arr = [];
            for (let i = 0; i < 3; i++) {
                arr.push({
                    id: (Math.random() * 1 + 1000).toString(),
                    manufacturer: "holy bajeebus",
                    name: "XONE:K2",
                    type: "input",
                    version: "over 9000",
                    state: "connected",
                    connection: "closed",
                    onmidimessage: function () { return void 0; },
                    onstatechange: function () { return void 0; }
                });
            }
            // @ts-ignore
            return arr;
        }

        this.online = true;
        // @ts-ignore
        this.inputs = createFakeInputs();
        // @ts-ignore
        this.setInputCbs = function (onmidicb, onstatechangecb) {
            this.inputs?.forEach(input => {
                input.onmidimessage = onmidicb;
                input.onstatechange = onstatechangecb;
            });
            return this;
        };
        // @ts-ignore
        this.setOutputCbs = function () {
            this.outputs?.forEach(output => {
                output.onmidimessage = function () { return void 0; };
                output.onstatechange = function () { return void 0; };
            });
            return this;
        };
        this.requestMIDIAccess = async function () {
            return Promise.resolve(MOCK_MIDI_ACCESS_RECORD);
        };
        this.getAccess = jest.fn().mockImplementation(function () {
            return { ...MOCK_MIDI_ACCESS_RECORD, onstatechange: onstatechangefn };
            // return MOCK_MIDI_ACCESS_RECORD;
        });
        this.getInstance = jest.fn().mockImplementation(() => {
            return this;
        });
        return this;
    };

    //MOCK MODULE OF MIDI UTILS FILE
    // module to mock returned object NOTE - make sure to mock all modules being exported individually!
    return {
        MIDIPort: { open: () => Promise.resolve({}) },
        MIDIPortType: { type: "input" },
        MIDIConnectionEvent: {},
        MIDIPortDeviceState: { connected: "connected" },
        MIDIPortConnectionState: { closed: "closed" },
        MIDIController: MockMIDIControllerConstructor
    };
});

describe("test selecting midi device toggles which device shows", () => {
    it("select device from dropdown menu", async () => {
        const history = createMemoryHistory();

        const { asFragment } = render(
            <Provider store={store}>
                <Router history={history}>
                    <MIDIListenerWrapper />
                </Router>
            </Provider>
        );

        const select = {
            dropdown: await screen.findByTestId("midi-select") as HTMLElement,
            options: await screen.findAllByTestId("select-option") as HTMLElement[],
        };

        expect(select.dropdown).toBeInTheDocument();
        expect(select.dropdown).toHaveValue("Select A Connected Device");

        expect(select.options).toHaveLength(4);

        act(() => {
            fireEvent.change(select.dropdown, { target: { value: "XONE:K2" } });
        });

        expect(select.dropdown).toHaveValue("XONE:K2");

        expect(asFragment()).toMatchSnapshot();

    });
});
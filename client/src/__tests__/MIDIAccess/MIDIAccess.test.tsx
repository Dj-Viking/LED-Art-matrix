/* eslint-disable @typescript-eslint/no-non-null-assertion */
//@ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../reducers";
import { mount, ReactWrapper } from "enzyme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, RenderResult, screen } from "@testing-library/react";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { LOCATION_DISPLAY_ID, SUPPORTED_CONTROLLERS } from "../../constants";
import {
    MIDIAccessRecord,
    MIDIConnectionEvent,
    MIDIMessageEvent,
} from "../../utils/MIDIControlClass";
import { TestService } from "../../utils/TestServiceClass";
import { act } from "react-dom/test-utils";
import { ITestMIDIProps, TestMIDI } from "../../components/MIDIListenerWrapper";

const store = createStore(
    combinedReducers,
    // @ts-expect-error this will exist in the browser
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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

jest.useFakeTimers();

TestService.createMockMIDIControllerClass();

describe("faking navigator for midiaccess testing", () => {
    test("fake the navigator.requestMIDIAccess callback func", async () => {
        const history = createMemoryHistory();

        await act(async () => {
            await new Promise<RenderResult>((resolve) =>
                resolve(
                    render(
                        <Provider store={store}>
                            <Router history={history}>
                                <App />
                            </Router>
                        </Provider>
                    )
                )
            );
        });

        expect((await screen.findByTestId(LOCATION_DISPLAY_ID)).textContent).toBe("/");
    });

    test("trying something", async () => {
        const history = createMemoryHistory();

        let app: ReactWrapper<any>;
        let testMidi: ReactWrapper<ITestMIDIProps>;

        await act(async () => {
            app = await new Promise<ReactWrapper<any>>((resolve) =>
                resolve(
                    mount(
                        <Provider store={store}>
                            <Router history={history}>
                                <App />
                            </Router>
                        </Provider>
                    )
                )
            );

            testMidi = app.find(TestMIDI);

            await act(async () => {
                await new Promise<void>((resolve) => {
                    // call onstatechange
                    testMidi.props().midi_access.access.onstatechange?.({
                        target: MOCK_MIDI_ACCESS_RECORD,
                    } as any);
                    // call onmidimessage
                    Object.keys(SUPPORTED_CONTROLLERS).forEach((key: string) => {
                        const name = testMidi.props().midi_access.inputs[0].name;
                        if (key.includes(name)) {
                            for (const key of Object.keys(SUPPORTED_CONTROLLERS[name]!)) {
                                const is2MiddleKnobOr1Fader: boolean =
                                    SUPPORTED_CONTROLLERS[name]![Number(key)] === "1_fader" ||
                                    SUPPORTED_CONTROLLERS[name]![Number(key)] === "2_middle_knob";

                                testMidi.props().midi_access.inputs[0].onmidimessage?.({
                                    currentTarget: testMidi.props().midi_access.inputs[0],
                                    data: new Uint8Array([
                                        1,
                                        Number(key),
                                        is2MiddleKnobOr1Fader ? 0 : 1,
                                    ]),
                                } as Partial<MIDIMessageEvent> as any);

                                testMidi.props().midi_access.inputs[0].onmidimessage?.({
                                    currentTarget: testMidi.props().midi_access.inputs[0],
                                    data: new Uint8Array([1, Number(key), 255]),
                                } as Partial<MIDIMessageEvent> as any);
                                jest.advanceTimersByTime(20);
                            }
                        }
                    });
                    resolve();
                });
            });

            // call device onstagechange
            testMidi.props().midi_access.inputs[0].onstatechange?.({
                currentTarget: testMidi.props().midi_access.access,
            } as Partial<MIDIConnectionEvent> as any);
        });
    });
});

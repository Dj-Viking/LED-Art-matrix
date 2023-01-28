/* eslint-disable @typescript-eslint/no-non-null-assertion */
//@ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { LOCATION_DISPLAY_ID } from "../../constants";
import { MIDIAccessRecord, MIDIController } from "../../utils/MIDIControlClass";
import { TestService } from "../../utils/TestServiceClass";

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

TestService.createMockMIDIControllerClass();

describe("faking navigator for midiaccess testing", () => {
  test("fake the navigator.requestMIDIAccess callback func", async () => {
    const history = createMemoryHistory();

    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

    expect((await screen.findByTestId(LOCATION_DISPLAY_ID)).textContent).toBe("/");

  });
});
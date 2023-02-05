/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
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
    }
  } as MIDIAccessRecord);
};

const store = createStore(allReducers);

describe("test the preset buttons are becoming active and inactive and clearing active status when clear button clicked", () => {
  it("tests page renders", () => {
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
    expect(screen.getByTestId("location-display").textContent).toBe("/");

    const btnsParent = screen.getByTestId("buttons-parent");
    expect(btnsParent.children).toHaveLength(10);

    const waves = screen.getByTestId("waves");

    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    // check the style of the button is active
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");

    const v2 = screen.getByTestId("v2");

    act(() => {
      v2.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("v2").classList).toHaveLength(1);
    expect(screen.getByTestId("v2").classList[0]).toBe("preset-button-active");
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-inactive");

    const clear = screen.getByTestId("clear");

    act(() => {
      clear.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("v2").classList).toHaveLength(1);
    expect(screen.getByTestId("v2").classList[0]).toBe("preset-button-inactive");
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-inactive");

    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");


    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");

  });
});
// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { EXPIRED_TOKEN, MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import { Router } from "react-router-dom";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { act } from "react-dom/test-utils";
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

afterEach(cleanup);

describe("test rendering the app and snapshot", () => {
  it("tests the app renders (simulating index.tsx I suppose)", async () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

    //for the midi access state update no act warning
    await act(async () => {
      window.dispatchEvent(TestService.createBubbledEvent("statechange"));
    });
  });

  it("matches snapshot DOM node structure", async () => {
    const history = createMemoryHistory();
    const { asFragment } = render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    //for the midi access state update no act warning
    await act(async () => {
      window.dispatchEvent(TestService.createBubbledEvent("statechange"));
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("tests if we arrive to home page with an expired token in storage that, the logout button is not there", async () => {
    const history = createMemoryHistory();
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", EXPIRED_TOKEN);

    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 400,
        json: () => {
          return Promise.resolve({
            error: "could not get preset at this time"
          });
        },
      });
    });

    render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>
      </>
    );

    await act(async() => {
      window.dispatchEvent(TestService.createBubbledEvent("statechange"));
    });

    expect(screen.getByTestId("location-display").textContent).toBe("/");
    const loginPageLink = (await screen.findAllByText(/^Login$/g)).find((el) => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(loginPageLink).toBeInTheDocument();
  });
});

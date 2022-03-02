



/* eslint-disable testing-library/no-unnecessary-act */
//@ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { TestService } from "../../utils/TestServiceClass";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { keyGen } from "../../utils/keyGen";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
const uuid = require("uuid");
// @ts-ignore need to implement a fake version of this for the jest test as expected
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

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };



describe("moving this to a separate file to avoid the leaky mocks that dont get cleared from the previous test", () => {

  it("tests that the api didn't send an array with items, buttons should not render", async () => {
  
    expect(screen.queryByTestId("waves")).not.toBeInTheDocument();
    const store = createStore(
      allReducers,
      // @ts-expect-error this will exist in the browser
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  
    expect(store.getState().presetButtonsListState.presetButtons).toHaveLength(0);
  
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", TestService.signTestToken({
      username: "test user",
      email: "test email",
      uuid: uuid.v4(),
      _id: keyGen(),
    }));
    expect(typeof localStorage.getItem("id_token")).toBe("string");
    
    const history = createMemoryHistory();
    const fakeFetchRes = (value: any): Promise<{ json: () => 
      Promise<any>; }> => Promise.resolve({ json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      .mockReturnValueOnce(fakeFetchRes({ presets: [] })) // and this is second 
                      .mockReturnValueOnce(fakeFetchRes({ preset: "waves" }));//this is first 
    //@ts-ignore
    global.fetch = mockFetch;
    render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>
      </>
    );
    expect(store.getState().presetButtonsListState.presetButtons).toHaveLength(0);
  
    expect(fetch).toHaveBeenCalledTimes(2);
  
    expect(screen.getByTestId("location-display").textContent).toBe("/");
  
    //only style tag should be present since we shouldn't get an array from the fake api fetch
    const buttonsParent2 = await screen.findByTestId("buttons-parent");
    expect(buttonsParent2.children).toHaveLength(1);
    
  });
});
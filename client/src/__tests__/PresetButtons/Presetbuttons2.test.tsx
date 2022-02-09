/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@jest/types";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { LOGIN_MOCK_TOKEN, MOCK_PRESETS } from "../../utils/mocks";
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

const originalFetch = global.fetch;

beforeEach(() => {
  const fakeFetchRes = (value: any): Promise<{ status: 200, json: () => 
    Promise<any>; }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value)});
  const mockFetch = jest.fn()
                    //default
                    // .mockReturnValue("kdfjkdj")
                    // first
                    .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
                    // second
                    .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
                    // third
                    .mockReturnValueOnce(fakeFetchRes({ preset: { presetName: "waves" } }));
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
    clear: screen.getByTestId("clear"),
    rainbowTest: screen.getByTestId("rainbowTest"),
    v2: screen.getByTestId("v2"),
    waves: screen.getByTestId("waves"),
    spiral: screen.getByTestId("spiral"),
    fourSpirals: screen.getByTestId("fourSpirals"),
    dm5: screen.getByTestId("dm5"),
    saveDefault: screen.getByTestId("saveDefault")
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
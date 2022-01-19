// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import "@types/jest";
import "@jest/types";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

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

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("test the buttons and led style is initialized", () => {

  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 400
      })
    );
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("tests the preset buttons render", async () => {
    
    render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    );


    const preset_buttons = {
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

  });

});
describe("test clicking all the preset buttons and that they change the led style state", () => {

  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 400
      })
    );
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("tests the led styles change when button is clicked", async () => {
    
    const { container } = render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    );

    const ledPre = container.querySelector("#led1-1") as HTMLElement;
    expect(ledPre.classList.contains("led1-1")).toBe(true);
    console.log("ledPre classlist", ledPre.classList);

    ledPre.classList.forEach((val: string, key: number, parent: DOMTokenList) => {
      console.log("val", val, "key", key, "parent", parent);
    });

    const preset_buttons = {
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
      preset_buttons.v2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const ledPost = container.querySelector("#led1-1") as HTMLElement;
    expect(ledPost.classList.contains("led1-1V2")).toBe(true);
    console.log("ledPost classlist", ledPost.classList);

    ledPost.classList.forEach((val: string, key: number, parent: DOMTokenList) => {
      console.log("val", val, "key", key, "parent", parent);
    });

    const styleTag = container.querySelector("#led-style");
    expect(styleTag).toBe("kdjkfjkd");

  });

});
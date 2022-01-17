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

  it("tests the preset buttons render", async () => {
    
    render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    );

    const preset_buttons = {
      rainbowTest: (await screen.findAllByRole("button", { name: "rainbowTest" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      v2: (await screen.findAllByRole("button", { name: "V2" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      waves: (await screen.findAllByRole("button", { name: "waves" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      spiral: (await screen.findAllByRole("button", { name: "spiral" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      fourSpirals: (await screen.findAllByRole("button", { name: "fourSpirals" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      dm5: (await screen.findAllByRole("button", { name: "DM5" })).find(el => {
        return el.classList.contains("preset-button-text");
      }),
      saveDefault: (await screen.findAllByRole("button", { name: "DM5" })).find(el => {
        return el.classList.contains("preset-button-text");
      })
    };

    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();

  });

});
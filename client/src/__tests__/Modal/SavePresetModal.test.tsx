/* eslint-disable testing-library/no-unnecessary-act */
//@ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";


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

describe("test the save modal functionality", () => {

  //TODO: finish the backend to finally test the api service function that saves the preset
  // to the user's preset collection

  const originalFetch = global.fetch;
  beforeEach(() => {
    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        json: () => {
          return Promise.resolve({
            saved: true
          });
        }
      });
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    cleanup();
  });
  it("tests the modal can have input changing and rendering, click the save button and close button", () => {
    const history = createMemoryHistory();

    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display").textContent).toBe("/");

    //open modal
    const savePresetBtn = screen.getByTestId("savePreset");

    act(() => {
      savePresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    const modal_els = {
      close: screen.getByTestId("modal-close-button") as HTMLElement,
      save: screen.getByTestId("modal-save-button") as HTMLElement,
      input: screen.getByTestId("modal-preset-name-input") as HTMLInputElement,
      animVar: screen.getByTestId("modal-anim-var-coeff") as HTMLElement
    };

    expect(modal_els.save).toBeDisabled();
    expect(modal_els.input.value).toBe("");
    expect(modal_els.animVar.textContent).toBe("Animation Variation: 64");

    //name input change
    act(() => {
      fireEvent.change(modal_els.input, { target: { value: "heres a name" } });
      modal_els.input.dispatchEvent(TestService.createBubbledEvent("change"));
    });

    expect(modal_els.input.value).toBe("heres a name");
    expect(modal_els.save).not.toBeDisabled();

    //start a preset to make the slider appear
    const v2 = screen.getByTestId("v2");
    act(() => {
      v2.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    // anim var coeff change with slider
    const slider = screen.getByTestId("led-anim-variation");

    act(() => {
      fireEvent.change(slider, { target: { value: "10" } });
      slider.dispatchEvent(TestService.createBubbledEvent("change"));
    });

    expect(modal_els.animVar.textContent).toBe("Animation Variation: 10");

    //click save button
    act(() => {
      modal_els.save.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    //open again
    act(() => {
      savePresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    //check text field is empty when opening again
    expect(screen.getByTestId("modal-preset-name-input").textContent).toBe("");

    //click close
    act(() => {
      modal_els.close.dispatchEvent(TestService.createBubbledEvent("click"));
    });

  });
});
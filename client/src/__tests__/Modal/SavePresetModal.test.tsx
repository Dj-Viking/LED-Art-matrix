/* eslint-disable testing-library/no-unnecessary-act */
//@ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
// import { ApiService } from "../../utils/ApiService";

// const mockGetUserPresets = jest.fn();
// jest.mock("../../utils/ApiService.ts", () => ({
//   ...jest.requireActual("../../utils/ApiService.ts"),
//   getUserPresets: () => {
//     return Promise.resolve({

//     });
//   },
// }));


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
  // the app will try to render buttons if we're logged in but if we don't have presets
  // then no buttons will render and the test will fail

  const originalFetch = global.fetch;
  it("tests the modal can have input changing and rendering, click the save button and close button", async () => {

    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        json: () => {
          return Promise.resolve({
            presets: [
              {
                _id: Math.random() * 1000 + "kdjfkjdlskfj",
                presetName: "v2",
                animVarCoeff: "64",
              },
              {
                _id: Math.random() * 1000 + "kdjfkjdlskfj",
                presetName: "waves",
                animVarCoeff: "64",
              }
            ]
          });
        }
      });
    });

    const history = createMemoryHistory();

    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", "TOKEN HERE YOU GO");
    expect(localStorage.getItem("id_token")).toBe("TOKEN HERE YOU GO");

    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("location-display").textContent).toBe("/");
    expect(fetch).toHaveBeenCalledTimes(2);
    // expect(fetch).toHaveBeenLastCalledWith("kdjfkdjf");

    //open modal
    const savePresetBtn = screen.getByTestId("savePreset");

    act(() => {
      savePresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    //if style display is flex the modal is open
    const styleValues = TestService.getStyles(screen.getByTestId("modal-base").style);
    expect(styleValues.values.display).toBe("flex");

    
    const modal_els = {
      close: screen.getByTestId("modal-close-button") as HTMLElement,
      save: screen.getByTestId("modal-save-button") as HTMLElement,
      input: screen.getByTestId("modal-preset-name-input") as HTMLInputElement,
      animVar: screen.getByTestId("modal-anim-var-coeff") as HTMLElement
    };
    //close for now
    act(() => {
      modal_els.close.dispatchEvent(TestService.createBubbledEvent("click"));
    });

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

    //okay somehow using this await will allow the buttons to appear,
    // since they will appear asynchronously because of an API fetch that
    // gets data to then set the state of the presetbuttons array which then renders buttons

    const awaitedButton = await screen.findByText(/v2/);
    expect(awaitedButton.classList).toHaveLength(1);
    expect(awaitedButton.classList[0]).toBe("preset-button-inactive");
    const buttonsParent = screen.getByTestId("buttons-parent");
    expect(buttonsParent.children).toHaveLength(3);

    //start a preset to make the slider appear
    const v2 = await screen.findByText(/v2/);
    act(() => {
      v2.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    //button should be active since we clicked it
    expect(awaitedButton.classList[0]).toBe("preset-button-active");

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

    //TODO: 
    
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

    //test the active/inactive class changing when clicking different preset buttons
    const waves = await screen.findByText(/waves/);
    expect(waves.classList).toHaveLength(1);
    expect(waves.classList[0]).toBe("preset-button-inactive");

    global.fetch = originalFetch;
    localStorage.clear();

    console.log("store state end of test 1", store.getState());
    jest.clearAllMocks();

  });

  it("tests that the api didn't send an array with items, buttons should not render", async () => {

    console.log("store state test 2", store.getState());

    global.fetch = originalFetch;
    localStorage.clear();


    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", "TOKEN HERE YOU GO");
    expect(localStorage.getItem("id_token")).toBe("TOKEN HERE YOU GO");

    //@ts-ignore
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        json: () => {
          return Promise.resolve({
            presets: []
          });
        }
      });
    });


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

    // expect(fetch).toHaveBeenCalledTimes(1);
    // expect(fetch).toHaveLastReturnedWith("kdjdfkjdkjs");
    // expect(fetch).toHaveBeenLastCalledWith("kdjfkdjf");

    
    //alright now for SOME REASON the components are persisting throughout these two it() blocks
    // how annoying, I'm trying to test that when I arrive to the page and don't get
    // an array of presets from the API that a button should not render in the button list render loop
    // however, from the previous test into this one, the components are persisting and not "cleaned up"

    //quite a shame that i have to do this and have to manually reset the components to
    // demonstrate what actually happens in reality when rendering the page for the first time and not
    // having an array of presets initially...

    // const awaitedButton = await screen.findByText(/v2/);
    // const awaitedWaves = await screen.findByText(/waves/);
    // const buttonsParent = screen.getByTestId("buttons-parent");
    // buttonsParent.removeChild(awaitedButton);
    // buttonsParent.removeChild(awaitedWaves);
    // expect(awaitedButton).not.toBeInTheDocument();

    expect(screen.getByTestId("location-display").textContent).toBe("/");

    //only style tag should be present since we shouldn't get an array from the fake api fetch
    const buttonsParent2 = screen.getByTestId("buttons-parent");
    expect(buttonsParent2.children).toHaveLength(1);
    
  });
});
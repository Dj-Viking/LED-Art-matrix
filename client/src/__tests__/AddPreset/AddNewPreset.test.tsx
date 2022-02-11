/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { TestService } from "../../utils/TestServiceClass";
import { MOCK_ADD_PRESET_RES, MOCK_PRESETS, MOCK_SIGN_TOKEN_ARGS } from "../../utils/mocks";

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


describe("Adding a preset", () => {
  it("tests the add preset function runs", async () => {
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
    expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

    const fakeFetchRes = (value: any): Promise<{ status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
                      .mockReturnValueOnce(fakeFetchRes({ preset: { presetName: "waves" } }))
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_ADD_PRESET_RES }));
    // @ts-ignore
    global.fetch = mockFetch;

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
    expect(fetch).toHaveBeenCalledTimes(2);
    const btnContainer = await screen.findByTestId("buttons-parent");
    expect(btnContainer.children).toHaveLength(12);

    // activate and change one of the constant/always provided presets and 
    // attempt to save it with some new parameter values
    const waves = await screen.findByTestId("waves");
    expect(waves).toBeInTheDocument();

    const modal_els = {
      close: await screen.findByTestId("modal-close-button"),
      save: await screen.findByTestId("modal-save-button"),
      input: await screen.findByTestId("modal-preset-name-input"),
      sliderVal: await screen.findByTestId("modal-anim-var-coeff")
    };
    const slider = await screen.findByTestId("led-anim-variation");
    
    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(slider).toBeInTheDocument();
    expect(modal_els.save).toBeInTheDocument();
    expect(modal_els.sliderVal).toBeInTheDocument();

    act(() => {
      fireEvent.change(slider, { target: { value: "10" }});
      slider.dispatchEvent(TestService.createBubbledEvent("change"));
    });

    expect(modal_els.sliderVal.textContent).toBe("Animation Variation: 10");

    //open the save preset modal
    const openSavePresetModalBtn = await screen.findByTestId("savePreset");
    expect(openSavePresetModalBtn).toBeInTheDocument();

    //type in the name of the preset
    act(() => {
      user.type(modal_els.input, "new preset");
      modal_els.input.dispatchEvent(TestService.createBubbledEvent("change"));
    });

    expect(modal_els.save).not.toBeDisabled();

    await act(async () => {
      modal_els.save.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenNthCalledWith(3, 
      "http://localhost:3001/user/add-preset", 
      {
        "body": expect.any(String), 
        "headers": {
          "Content-Type": "application/json", 
          "authorization": expect.any(String)
        },
        "method": "POST"
      }
    );

    expect(btnContainer.children).toHaveLength(13);
    const newPresetBtn = await screen.findByText(/new preset/);
    expect(newPresetBtn).toBeInTheDocument();

  });
});
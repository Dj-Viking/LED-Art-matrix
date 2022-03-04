/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { ASSERT_ANIMATION, MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";

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

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));


describe("Test that the animation variation slider changes the style values", () => {
  afterEach(() => {
    cleanup();
  });

  it("tests that slider renders", async () => {

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
    
    const preset_buttons = {
      clear: await screen.findByTestId("clear"),
      rainbowTest: await screen.findByTestId("rainbowTest"),
      v2: await screen.findByTestId("v2"),
      waves: await screen.findByTestId("waves"),
      spiral: await screen.findByTestId("spiral"),
      fourSpirals: await screen.findByTestId("fourSpirals"),
      dm5: await screen.findByTestId("dm5"),
      saveDefault: await screen.findByTestId("saveDefault")
    };

    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();

    expect(screen.getByTestId("led1-1").classList).toHaveLength(1);

    act(() => {
      preset_buttons.rainbowTest.dispatchEvent(TestService.createBubbledEvent("click"));
    });


    //before
    const ledStyleRef = screen.getByTestId("led-style");

    const styleSplit = ledStyleRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    
    expect(styleSplit.length > 0).toBe(true);
    const delayMatches: string[] | [] = styleSplit.map(str => {
      if (ASSERT_ANIMATION.delayStyleRegex.test(str)) return str;
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    let delayValBefore = delayMatches[0].trim();
    expect(delayValBefore).toBe("animation-delay: 0.3003225088967971s;");

    let sliderRef: HTMLInputElement;
    sliderRef = screen.getByTestId("led-anim-variation") as HTMLInputElement;
    expect(sliderRef).toBeInTheDocument();

    act(() => {
      fireEvent.change(sliderRef, { target: { value: "100" } });
      sliderRef.dispatchEvent(TestService.createBubbledEvent("change"));
    });


    sliderRef = screen.getByTestId("led-anim-variation") as HTMLInputElement;
    expect(sliderRef.value).toBe("100"); 

    // TODO: parse the style values from the stylesheet
    // to check if the animation-duration and/or delays are
    // changing

    const ledStyleRef2 = screen.getByTestId("led-style");
    
    const styleSplit2 = ledStyleRef2?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    expect(styleSplit2.length > 0).toBe(true);
    const delayMatches2: string[] | [] = styleSplit2.map(str => {
      if (ASSERT_ANIMATION.delayStyleRegex.test(str)) return str;
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    expect(delayMatches2.length).toBe(1024);

    const delayValAfter = delayMatches2[0].trim();
    expect(delayValAfter).toBe("animation-delay: 0.2079326923076923s;");

  });

});
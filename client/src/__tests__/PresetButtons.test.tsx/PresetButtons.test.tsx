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

describe("test the buttons and led style is initialized", () => {

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

  const assertAnimation = {
    clearLed: "led1-1",
    keyframes: /keyframes/g,
    rainbowTest: {
      regex: /rainbowTestAllAnim/g,
      classListItem: "led1-1rainbowTestAllAnim"
    },
    v2: {
      regex: /V2/g,
      classListItem: "led1-1V2",
    },
    waves: {
      regex: /waves/g,
      classListItem: "led1-1waves",
      
    },
    spiral: {
      regex: /spiral/g,
      classListItem: "led1-1spiral"
    },
    fourSpirals: {
      regex: /fourSpirals/g,
      classListItem: "led1-1fourSpirals"
    },
    dm5: {
      regex: /dm5/g,
      classListItem: "led1-1dm5"
    },
  };

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

  //RAINBOW TEST
  it("tests the led styles change to rainbowTest when rainbow button is clicked", async () => {
    
    const { container } = render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    );

    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();

    ledPreRef.classList.forEach((value: string, key: number, parent: DOMTokenList) => {
      console.log("value", value, "key", key, "parent", parent);
    });

    expect(ledPreRef.classList.contains("led1-1")).toBe(true);

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

    let ledPost: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;

    act(() => {
      preset_buttons.rainbowTest.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPost = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPost).toBeInTheDocument();
    expect(ledPost.classList.contains("led1-1rainbowTestAllAnim")).toBe(true);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (assertAnimation.rainbowTest.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (assertAnimation.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    
    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    clearLedRef.classList.forEach((value: string, key: number, parent: DOMTokenList) => {
      console.log("value", value, "key", key, "parent", parent);
    });
    expect(clearLedRef.classList.contains("led1-1")).toBe(true);


  });
  //V2
  it("tests the led styles change to v2 when v2 button is clicked", async () => {
    
    const { container } = render(
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    );

    //get ref to led element and check it's there+
    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();
    expect(ledPreRef.classList[0]).toBe(assertAnimation.clearLed);

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

    expect(preset_buttons.clear).toBeInTheDocument();
    expect(preset_buttons.rainbowTest).toBeInTheDocument();
    expect(preset_buttons.v2).toBeInTheDocument();
    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeInTheDocument();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;

    //  TODO: SIGN IN A USER BEFORE CLICKING THE BUTTONS THAT ARE DISABLED IF NOT SIGNED IN
    act(() => {
      preset_buttons.v2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(assertAnimation.v2.classListItem);


    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (assertAnimation.v2.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (assertAnimation.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(assertAnimation.clearLed);

  });

});
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@jest/types";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { ASSERT_ANIMATION, LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_TOKEN } from "../../utils/mocks";

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

describe("testing router because if i log in then i can route back to home and click the previously disabled buttons", () => {

  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(LOGIN_MOCK_TOKEN)
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
  
  it("full app rendering/navigating", async () => {
    const history = createMemoryHistory();
    
    render(
      <Provider store={store}>
        <Router history={history}>s
          <App />
        </Router>,
      </Provider>
    );

    const hiddenHistoryRef = screen.getByTestId("location-display");
    expect(hiddenHistoryRef).toHaveTextContent("/");
    
    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);
    //should be on login page
    const hiddenHistoryRef2 = screen.getByTestId("location-display");
    expect(hiddenHistoryRef2).toHaveTextContent("/login");

    const inputEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };
    expect(inputEls.emailOrUsername).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(inputEls.btn).toBeInTheDocument();

    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);
    
    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);

    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    //should be routed home after logging in
    expect(hiddenHistoryRef2).toHaveTextContent("/");

  });

  it("tests the preset buttons render", async () => {
    const history = createMemoryHistory();
    
    render(
      <>
        <Router history={history}>
          <Provider store={store}>
            <App />
          </Provider>
        </Router>
      </>
    );
    const hiddenHistoryRef = screen.getByTestId("location-display");
    expect(hiddenHistoryRef).toHaveTextContent("/");


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
    expect(preset_buttons.waves).toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).toBeDisabled();
    
    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).toBeDisabled();
    
  });

});
describe("test clicking all the preset buttons and that they change the led style state", () => {

  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(LOGIN_MOCK_TOKEN)
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  //RAINBOW TEST
  it("tests the led styles change to rainbowTest when rainbow button is clicked", async () => {
    const history = createMemoryHistory();

    const { container } = render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>
      </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();

    // ledPreRef.classList.forEach((value: string, key: number, parent: DOMTokenList) => {
      // console.log("value", value, "key", key, "parent", parent);
    // });

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
      if (ASSERT_ANIMATION.rainbowTest.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    
    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // clearLedRef.classList.forEach((value: string, key: number, parent: DOMTokenList) => {
      // console.log("value", value, "key", key, "parent", parent);
    // });
    expect(clearLedRef.classList.contains("led1-1")).toBe(true);

  });
  
  //V2
  it("tests the led styles change to v2 when v2 button is clicked", async () => {
    const history = createMemoryHistory();
    
    const { container } = render(
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

    //get ref to led element and check it's there+
    const ledPreRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPreRef).toBeInTheDocument();
    expect(ledPreRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

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
   
    act(() => {
      preset_buttons.v2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.v2.classListItem);


    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (ASSERT_ANIMATION.v2.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

  });

});

describe("test logging in and checking buttons become un-disabled", () => {
  
  //create a reference to the original fetch before we change it swap it back
  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(LOGIN_MOCK_TOKEN),
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    //keep local storage token from the login
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    
    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);

    expect(screen.getByTestId("location-display")).toHaveTextContent("/login");
    
    const inputEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };
    expect(inputEls.emailOrUsername).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(inputEls.btn).toBeInTheDocument();

    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);
    
    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);

    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    expect(localStorage.getItem("id_token")).toBeTruthy();

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
    expect(preset_buttons.waves).not.toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).not.toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).not.toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).not.toBeDisabled();

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();
    
  });

  //WAVES
  it("checks token and test undisabled waves button", async () => {
    expect(localStorage.getItem("id_token")).toBeTruthy();

    const history = createMemoryHistory();
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

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
    expect(preset_buttons.waves).not.toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).not.toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).not.toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).not.toBeDisabled();

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;
   
    act(() => {
      preset_buttons.waves.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.waves.classListItem);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (ASSERT_ANIMATION.waves.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

  });

  //SPIRAL
  it("checks token and test undisabled spiral button", async () => {
    expect(localStorage.getItem("id_token")).toBeTruthy();

    const history = createMemoryHistory();
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

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
    expect(preset_buttons.waves).not.toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).not.toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).not.toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).not.toBeDisabled();

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;
   
    act(() => {
      preset_buttons.spiral.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.spiral.classListItem);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (ASSERT_ANIMATION.spiral.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

  });

  //FOURSPIRALS
  it("checks token and test undisabled fourSpirals button", async () => {
    expect(localStorage.getItem("id_token")).toBeTruthy();

    const history = createMemoryHistory();
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

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
    expect(preset_buttons.waves).not.toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).not.toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).not.toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).not.toBeDisabled();

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;
   
    act(() => {
      preset_buttons.fourSpirals.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.fourSpirals.classListItem);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (ASSERT_ANIMATION.fourSpirals.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

  });

  //DM5
  it("checks token and test undisabled DM5 button", async () => {
    expect(localStorage.getItem("id_token")).toBeTruthy();

    const history = createMemoryHistory();
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

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
    expect(preset_buttons.waves).not.toBeDisabled();

    expect(preset_buttons.spiral).toBeInTheDocument();
    expect(preset_buttons.spiral).not.toBeDisabled();

    expect(preset_buttons.fourSpirals).toBeInTheDocument();
    expect(preset_buttons.fourSpirals).not.toBeDisabled();

    expect(preset_buttons.dm5).toBeInTheDocument();
    expect(preset_buttons.dm5).not.toBeDisabled();

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;
   
    act(() => {
      preset_buttons.dm5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(ledPostRef).toBeInTheDocument();
    expect(ledPostRef.classList.length).toBe(1);
    // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
    expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.dm5.classListItem);

    styleTagRef = container.querySelector("#led-style");
    expect(typeof styleTagRef).toBe("object");
    expect(!!styleTagRef?.textContent).toBe(true);

    // parse the styleTagRef content to get the animation name and confirm it matches the
    // style in the classlist so therefore the @keyframes animation name should appear
    // in the keyframe matching array
    const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
    const animationNameMatches: string[] | [] = splitTagText.map(str => {
      if (ASSERT_ANIMATION.dm5.regex.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string") as string[] | [];

    const keyFramesMatches = animationNameMatches.map(str => {
      if (ASSERT_ANIMATION.keyframes.test(str)) {
        return str;
      }
      return void 0;
    }).filter(item => typeof item === "string");
    // console.log("key frames arr", keyFramesMatches);

    expect(keyFramesMatches).toHaveLength(1);

    //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
    let clearLedRef = screen.getByTestId("led1-1");
    act(() => {
      preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
    expect(clearLedRef).toBeInTheDocument();
    expect(clearLedRef.classList.length).toBe(1);
    // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
    expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);

  });

});
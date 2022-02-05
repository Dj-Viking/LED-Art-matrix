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
import { ASSERT_ANIMATION, LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_TOKEN, SAVE_DEFAULT_MOCK_ERROR, SAVE_DEFAULT_MOCK_SUCCESS } from "../../utils/mocks";

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

describe("test the save default button is making the request, mock the response", () => {

  const originalFetch = global.fetch;
  
  afterEach(() => {
    cleanup();
    //leave storage with token
    global.fetch = originalFetch;
  });
  
  it("logs in so the next test can have buttons enabled", async () => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(LOGIN_MOCK_TOKEN)
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

    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    expect(localStorage.getItem("id_token")).toBeTruthy();

    //once for logging in and then twice for going to "/" and fetching the user's preset
    // since we're logged in then the get user preset fetch happens
    expect(fetch).toHaveBeenCalledTimes(2);

  });

  it("tests the save default button", async () => {
    expect(localStorage.getItem("id_token")).toBeTruthy();
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(SAVE_DEFAULT_MOCK_SUCCESS)
      })
    );
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

    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    //since we are logged in here fetch will be called with the get user default preset func
    expect(fetch).toHaveBeenCalledTimes(1);

    const preset_buttons = {
      saveDefault: screen.getByTestId("saveDefault")
    };

    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    await act(async () => {
      preset_buttons.saveDefault.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("tests the save default button with error response", async () => {
    

    expect(localStorage.getItem("id_token")).toBeTruthy();
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
    //res
      Promise.resolve({
        ok: void 0,
        json: () => Promise.resolve({
          preset: "waves"
        })
      })
    );
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
    //since we are logged in here fetch will be called with the get user default preset func
    expect(fetch).toHaveBeenCalledTimes(1);

    const preset_buttons = {
      waves: screen.getByTestId("waves"),
      saveDefault: screen.getByTestId("saveDefault")
    };

    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.waves).not.toBeDisabled();
    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();

    // get led ref and style tag ref for after the click event and state updates
    let ledPostRef: HTMLElement | null = null;
    let styleTagRef: HTMLStyleElement | null = null;

    await act(async () => {
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

    // @ts-ignore trying to mock fetch for update preset fetch request
    global.fetch = jest.fn(() => 
    //res
      Promise.resolve({
        ok: void 0,
        json: () => Promise.resolve(SAVE_DEFAULT_MOCK_ERROR)
      })
    );

    await act(async () => {
      preset_buttons.saveDefault.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetch).toHaveBeenCalledTimes(1);

  });

});
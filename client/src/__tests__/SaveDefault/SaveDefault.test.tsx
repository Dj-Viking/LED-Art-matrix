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
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { ASSERT_ANIMATION, LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_TOKEN, MOCK_PRESETS, SAVE_DEFAULT_MOCK_ERROR, SAVE_DEFAULT_MOCK_SUCCESS } from "../../utils/mocks";
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

describe("test the save default button is making the request, mock the response", () => {

  const originalFetch = global.fetch;
  
  afterEach(() => {
    cleanup();
    //leave storage with token
    global.fetch = originalFetch;
  });
  
  it("logs in so the next test can have buttons enabled", async () => {
    const fakeFetchRes = (value: any): Promise<{ ok: boolean, status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      //default
                      // .mockReturnValue("kdfjkdj")
                      // first
                      .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
                      // second
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
                      // third
                      .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" } }))
                      // fourth getting default preset inside PresetButtons component for setting active on page load while logged in
                      .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" } }));
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
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    expect(fetch).toHaveBeenCalledTimes(0);

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
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenNthCalledWith(1, "http://localhost:3001/user/login", {"body": expect.any(String), "headers": {"Content-Type": "application/json"}, "method": "POST"});
    // expect(fetch).toHaveBeenNthCalledWith(2, "kdjfkdjjk");
    
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    expect(localStorage.getItem("id_token")).toBeTruthy();

    //once for logging in and then twice for going to "/" and fetching the user's preset
    // since we're logged in then the get user preset fetch happens

    // fourth time is getting the default inside presetbuttons component to set it active on page load while logged in
    expect(fetch).toHaveBeenCalledTimes(4);
    // expect(fetch).toHaveBeenNthCalledWith(4, "kdfjdkkj"); 

    const wavesActive = await screen.findByTestId("waves");
    expect(wavesActive.classList).toHaveLength(1);
    expect(wavesActive.classList[0]).toBe("preset-button-active");

  });

  it("tests the save default button", async () => {
    expect(typeof localStorage.getItem("id_token")).toBe("string");
    const fakeFetchRes = (value: any): Promise<{ ok: boolean, status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      //default
                      // .mockReturnValue("kdfjkdj")
                      // first
                      .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" } }))
                      // second
                      .mockReturnValueOnce(fakeFetchRes(SAVE_DEFAULT_MOCK_SUCCESS))
                      // third
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }));
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

    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    //since we are logged in here fetch will be called with the get user default preset func
    expect(fetch).toHaveBeenCalledTimes(1);
    // expect(fetch).toHaveBeenNthCalledWith(1, "dkjfdkj");

    const preset_buttons = {
      saveDefault: screen.getByTestId("saveDefault"),
      waves: await screen.findByTestId("waves")
    };

    // default should be active on page load

    expect(preset_buttons.waves).toBeInTheDocument();
    expect(preset_buttons.waves.classList).toHaveLength(1);
    
    expect(preset_buttons.saveDefault).toBeInTheDocument();
    expect(preset_buttons.saveDefault).not.toBeDisabled();
    
    //make waves active so that we can save it as default
    act(() => {
      preset_buttons.waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    
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
          preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" }
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
      waves: await screen.findByTestId("waves"),
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
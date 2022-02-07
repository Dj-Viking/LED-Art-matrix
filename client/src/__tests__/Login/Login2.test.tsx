/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_TOKEN } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

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


describe("test signup functionality with token", () => {
  document.body.innerHTML = "";

  //create a reference to the original fetch before we change it swap it back
  const originalFetch = global.fetch;
  beforeEach(() => {
    const fakeFetchRes = (value: any): Promise<{ status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      //default
                      // .mockReturnValue("kdfjkdj")
                      // first
                      .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
                      // second
                      .mockReturnValueOnce(fakeFetchRes({ presets: [] }))
                      // third
                      .mockReturnValueOnce(fakeFetchRes({ preset: "waves" }));
    // @ts-ignore
    global.fetch = mockFetch;
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear(); //clear local storage since this test will set a token in LS and log a user in
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {
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

    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);

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
    expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.password);
    // fireEvent.click(inputEls.btn);
    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // console.log("local storage", localStorage.getItem("id_token"));

    //not sure why logout button can't be found might have to fake local storage too.
    const logout = (await screen.findAllByText(/Logout/g)).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;

    expect(logout).toBeInTheDocument();

    // fireEvent.click(logout);
    document.body.innerHTML = "";
  });
});
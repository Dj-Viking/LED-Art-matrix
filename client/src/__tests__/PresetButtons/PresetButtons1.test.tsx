/* eslint-disable testing-library/no-unnecessary-act */
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
import { LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_TOKEN, MOCK_PRESETS } from "../../utils/mocks";

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
                    .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
                    // third
                    .mockReturnValueOnce(fakeFetchRes({ preset: { presetName: "waves" } }));
  // @ts-ignore
  global.fetch = mockFetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  cleanup();
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

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenNthCalledWith(1, 
    "http://localhost:3001/user/login", 
    {
      "body": "{\"usernameOrEmail\":{\"username\":\"i existi exist\"},\"password\":\"believe itbelieve it\"}", "headers": {
        "Content-Type": "application/json"
      }, 
      "method": "POST"
    }
  );
  // expect(fetch).toHaveBeenNthCalledWith(2, "kdjfkdj");

  //should be routed home after logging in
  expect(hiddenHistoryRef2).toHaveTextContent("/");

});
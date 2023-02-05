/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_PAYLOAD_EMAIL, LOGIN_MOCK_NO_TOKEN, LOGIN_MOCK_TOKEN, MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
// import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
// import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
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

const store = createStore(
  allReducers,
  // @ts-expect-error this will exist in the browser
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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

//TODO IMPLEMENT WINDOW NAVIGATION window.location.assign() for login test

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));



describe("Test rendering login correctly", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    const fakeFetchRes = (value: any): Promise<{
      status: 200, json: () =>
        Promise<any>;
    }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
    const mockFetch = jest.fn()
      // first
      .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
      // second
      .mockReturnValueOnce(fakeFetchRes({ presets: [] }))
      // third
      .mockReturnValueOnce(fakeFetchRes({ displayName: "", preset: "waves" }))
      // fourth
      .mockReturnValueOnce(fakeFetchRes({ displayName: "", preset: "waves" }));
    // @ts-ignore
    global.fetch = mockFetch;
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear();
  });

  it("Render the home page and then click Login button to go to that page", async () => {
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
    await act(async () => {
      return void 0;
    });
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId("location-display").textContent).toBe("/");
    await act(async () => {
      return void 0;
    });

    const page = (await screen.findAllByText(/^Login$/g)).find((el) => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);
    expect(screen.getByTestId("location-display").textContent).toBe("/login");
    await act(async () => {
      return void 0;
    });

    const formEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      login: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(formEls.emailOrUsername).toBeInTheDocument();
    expect(formEls.password).toBeInTheDocument();
    expect(formEls.login).toBeInTheDocument();

    //type in email here
    // fireEvent.change(formEls.emailOrUsername, { target: { value: LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername }});
    // fireEvent.change(formEls.password, { target: { value: LOGIN_MOCK_PAYLOAD_EMAIL.password }});
    user.type(formEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    user.type(formEls.password, LOGIN_MOCK_PAYLOAD_EMAIL.password);
    expect(formEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    expect(formEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.password);

    //submit login
    // fireEvent.click(formEls.login);

    await act(async () => {
      formEls.login.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await act(async () => {
      return void 0;
    });
    expect(screen.getByTestId("location-display").textContent).toBe("/");
    await act(async () => {
      return void 0;
    });

    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenNthCalledWith(1,
      "http://localhost:3001/user/login",
      {
        "body": "{\"usernameOrEmail\":{\"email\":\"iexist@exist.com\"},\"password\":\"believe it\"}",
        "headers": {
          "Content-Type": "application/json"
        },
        "method": "POST"
      }
    );

  });
});

describe("test signup functionality with no token", () => {

  //create a reference to the original fetch before we change it swap it back
  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(LOGIN_MOCK_NO_TOKEN),
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear();
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
    await act(async () => {
      return void 0;
    });
    expect(screen.getByTestId("location-display").textContent).toBe("/");
    await act(async () => {
      return void 0;
    });

    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);
    expect(screen.getByTestId("location-display").textContent).toBe("/login");

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

    // fireEvent.change(inputEls.emailOrUsername, { target: { value: LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername }});
    // fireEvent.change(inputEls.password, { target: { value: LOGIN_MOCK_PAYLOAD_USERNAME.password }});
    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);
    expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.password);

    // fireEvent.click(inputEls.btn);
    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByTestId("location-display").textContent).toBe("/login");

    history.push("/");

  });
});
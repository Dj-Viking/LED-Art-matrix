// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { FORGOT_MOCK_INPUT, FORGOT_MOCK_RES, FORGOT_MOCK_RES_ERROR, } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
// import { act } from "react-dom/test-utils";
import { TestApiServiceClass } from "../../utils/TestApiServiceClass";
const tapi = new TestApiServiceClass("alive");

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

//TODO IMPLEMENT WINDOW NAVIGATION window.location.assign() for signup test

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("Test rendering forgot password page", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(FORGOT_MOCK_RES),
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Render the home page and then click sign up button to go to that page", async () => {
    expect(tapi.alive()).toBe("alive");
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const link = await screen.findByText(/^Login$/g);
    fireEvent.click(link);
    const forgotLink = screen.getAllByRole("button", { name: "Forgot Password?" }).find((btn) => {
      return btn.style.textDecoration === "none";
    }) as HTMLElement;
    expect(forgotLink).toBeInTheDocument();
    fireEvent.click(forgotLink);
    const forgotEls = {
      forgotEmail: screen.getByPlaceholderText(/email@example.com/g),
    };
    expect(forgotEls.forgotEmail).toBeInTheDocument();
    fireEvent.change(forgotEls.forgotEmail);

    expect(fetch).toHaveBeenCalledTimes(0);

  });
});

describe("Test sending forgot pass request", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(FORGOT_MOCK_RES),
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Render the home page and then click sign up button to go to that page", async () => {
    expect(tapi.alive()).toBe("alive");
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const link = await screen.findByText(/^Login$/g);
    fireEvent.click(link);
    const forgotLink = screen.getAllByRole("button", { name: "Forgot Password?" }).find((btn) => {
      return btn.style.textDecoration === "none";
    }) as HTMLElement;
    expect(forgotLink).toBeInTheDocument();
    fireEvent.click(forgotLink);
    const forgotEls = {
      forgotEmail: screen.getByPlaceholderText(/email@example.com/g),
      btn: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
        return btn.classList.contains("form-btn-disabled");
      }) as HTMLElement
    };
    expect(forgotEls.forgotEmail).toBeInTheDocument();
    expect(forgotEls.btn).toBeInTheDocument();
    fireEvent.change(forgotEls.forgotEmail, { target: { value: FORGOT_MOCK_INPUT.email } });
    fireEvent.click(forgotEls.btn);

  });
});
describe("Test request error mock", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: FORGOT_MOCK_RES_ERROR.status,
        json: () => Promise.resolve(FORGOT_MOCK_RES_ERROR),
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Render the home page and then click sign up button to go to that page", async () => {
    expect(tapi.alive()).toBe("alive");
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const link = await screen.findByText(/^Login$/g);
    fireEvent.click(link);
    const forgotLink = screen.getAllByRole("button", { name: "Forgot Password?" }).find((btn) => {
      return btn.style.textDecoration === "none";
    }) as HTMLElement;
    expect(forgotLink).toBeInTheDocument();
    fireEvent.click(forgotLink);
    const forgotEls = {
      forgotEmail: screen.getByPlaceholderText(/email@example.com/g),
      btn: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
        return btn.classList.contains("form-btn-disabled");
      }) as HTMLElement
    };
    expect(forgotEls.forgotEmail).toBeInTheDocument();
    expect(forgotEls.btn).toBeInTheDocument();
    fireEvent.change(forgotEls.forgotEmail, { target: { value: FORGOT_MOCK_INPUT.email } });
    fireEvent.click(forgotEls.btn);

  });
});


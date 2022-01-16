// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { SIGNUP_MOCK_PAYLOAD, SIGNUP_MOCK_RESULT } from "../../utils/mocks";
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



describe("Test rendering signup correctly", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(SIGNUP_MOCK_RESULT),
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

    const link = await screen.findByText(/^Sign\sUp$/g);

    fireEvent.click(link);

    // act(() => {
      // link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    const formEls = {
      username: (await screen.findByText(/Username:/g)),
      email: (await screen.findByText(/Email:/g)),
      password: (await screen.findByText(/Password:/g)),
      signup: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
        return btn.classList.contains("form-btn");
      })
    };

    expect(formEls.username).toBeInTheDocument();
    expect(formEls.email).toBeInTheDocument();
    expect(formEls.password).toBeInTheDocument();
    expect(formEls.signup).toBeInTheDocument();

  });
});

describe("test signup functionality", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(SIGNUP_MOCK_RESULT),
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const page = (await screen.findAllByText(/^Sign\sUp$/g)).find((el) => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;

    fireEvent.click(page);

    // act(() => {
    //   page.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    const inputEls = {
      username: screen.getByPlaceholderText(/my_username/g),
      email: screen.getByPlaceholderText(/example@email.com/g),
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g)
    };

    const btn = screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
      return btn.classList.contains("form-btn");
    }) as HTMLElement;

    //check the input elements are in the document
    expect(inputEls.username).toBeInTheDocument();
    expect(inputEls.email).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(btn).toBeInTheDocument();

    // type inputs to form fields and submit

    fireEvent.change(inputEls.username, { target: { value: SIGNUP_MOCK_PAYLOAD.username }});
    fireEvent.change(inputEls.email, { target: { value: SIGNUP_MOCK_PAYLOAD.email }});
    fireEvent.change(inputEls.password, { target: { value: SIGNUP_MOCK_PAYLOAD.password }});

    // act(() => {
    //   inputEls.username.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.username));
    //   inputEls.email.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.email));
    //   inputEls.password.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.password));
    // });

    //click signup to simulate api mock
    
    fireEvent.click(btn);

    // act(() => {
    //   btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });
  });
});
describe("Tests network error message", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.reject({
        message: new Error("network is down").message
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const link = await screen.findByText(/^Sign\sUp$/g);

    fireEvent.click(link);

    // act(() => {
    //   link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    const inputEls = {
      username: screen.getByPlaceholderText(/my_username/g),
      email: screen.getByPlaceholderText(/example@email.com/g),
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g)
    };

    const btn = screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
      return btn.classList.contains("form-btn");
    }) as HTMLElement;

    //check the input elements are in the document
    expect(inputEls.username).toBeInTheDocument();
    expect(inputEls.email).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(btn).toBeInTheDocument();

    fireEvent.change(inputEls.username, { target: { value: SIGNUP_MOCK_PAYLOAD.username }});
    fireEvent.change(inputEls.email, { target: { value: SIGNUP_MOCK_PAYLOAD.email }});
    fireEvent.change(inputEls.password, { target: { value: SIGNUP_MOCK_PAYLOAD.password }});

    // type inputs to form fields and submit
    // act(() => {
    //   inputEls.username.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.username));
    //   inputEls.email.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.email));
    //   inputEls.password.dispatchEvent(new KeyboardEvent(SIGNUP_MOCK_PAYLOAD.password));
    // });

    //click signup to simulate api mock

    fireEvent.click(btn);

    // act(() => {
    //   btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    expect(fetch).toReturn();
    
  });
});
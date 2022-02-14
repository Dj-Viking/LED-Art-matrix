/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { LOGIN_MOCK_PAYLOAD_EMAIL} from "../../utils/mocks";
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
    localStorage.clear();
  });

  it("Checks the input fields are available and can submit with a stubbed api to get the network error message", async () => {
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
    
    const page = (await screen.findAllByText(/Login/g)).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);
    expect(screen.getByTestId("location-display").textContent).toBe("/login");
    
    const formEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      loginBtn: screen.getAllByRole("button", { name: "Login" }).find((loginBtn) => {
        return loginBtn.classList.contains("form-btn");
      }) as HTMLElement
    };

    //check the input elements are in the document
    expect(formEls.emailOrUsername).toBeInTheDocument();
    expect(formEls.password).toBeInTheDocument();
    expect(formEls.loginBtn).toBeInTheDocument();

    // type inputs to form fields and submit
    await act(async () => {
      formEls.emailOrUsername.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername));
      formEls.password.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.password));
    });

    user.type(formEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    user.type(formEls.password, LOGIN_MOCK_PAYLOAD_EMAIL.password);
    expect(formEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    expect(formEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.password);

    
    //click signup to simulate api mock
    //clicking the button will start an asynchronous fetch that will update state during and after the async function is done
    await act(async () => {
      formEls.loginBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("location-display").textContent).toBe("/login");
    
  });
});
/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import { LOGIN_MOCK_PAYLOAD_EMAIL } from "../../utils/mocks";
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

it("shows login error message", async () => {
  // @ts-ignore
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      status: 400,
    });
  });
  expect(localStorage.getItem("id_token")).toBe(null);
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


  const page = (await screen.findAllByText(/^Login$/g)).find((el) => {
    return el.classList.contains("nav-button");
  }) as HTMLElement;
  expect(page).toBeInTheDocument();
  fireEvent.click(page);
  expect(screen.getByTestId("location-display").textContent).toBe("/login");
  
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

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenNthCalledWith(1, 
      "http://localhost:3001/user/login", 
      {
        "body": expect.any(String), 
        "headers": {
          "Content-Type": "application/json"
        }, 
        "method": "POST"
      }
    );
    expect(screen.getByTestId("location-display").textContent).toBe("/login");
    expect((await screen.findByText(/Invalid\scredentials/))).toBeInTheDocument();
});
// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { SIGNUP_MOCK_RESULT } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { TestService } from "../../utils/TestServiceClass";
const tapi = new TestService("alive");

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

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
  localStorage.clear();
});

it("Render the home page and then click sign up button to go to that page", async () => {

  // @ts-ignore trying to mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(SIGNUP_MOCK_RESULT),
    })
  );

  expect(tapi.alive()).toBe("alive");
  const history = createMemoryHistory();

  render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  );

  const link = await screen.findByText(/^Sign\sUp$/g);
  expect(link).toBeInTheDocument();
  fireEvent.click(link);

  const formEls = {
    username: screen.getByPlaceholderText(/my_username/g),
    email: screen.getByPlaceholderText(/example@email.com/g),
    password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g),
    signup: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
      return btn.classList.contains("form-btn");
    }) as HTMLElement
  };

  expect(formEls.username).toBeInTheDocument();
  expect(formEls.email).toBeInTheDocument();
  expect(formEls.password).toBeInTheDocument();
  expect(formEls.signup).toBeInTheDocument();

});
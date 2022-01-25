// @ts-ignore
import React from "react";
import ChangePassword from "../../pages/ChangePassword";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, cleanup, screen } from "@testing-library/react";
import { CHANGE_PASS_INPUT_MATCH, CHANGE_PASS_MOCK_RES, } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { HiddenLocationDisplay } from "../../App";


const store = createStore(
  allReducers,
  // @ts-expect-error this will exist in the browser
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

const mockHistoryReplace = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("test that the fake window location pathname works with the jest test", () => {
  
  const originalFetch = global.fetch;

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });


  it("render the change password page and enter a new password, should redirect to home", async () => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(CHANGE_PASS_MOCK_RES),
      })
    );

    const history = createMemoryHistory({
      initialEntries: ["/changePassword/HERESATOKEN"]
    });

    render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <ChangePassword />
            <HiddenLocationDisplay />
          </Router>
        </Provider>
      </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

    const formEls = {
      newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
      confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
      submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(formEls.newPass).toBeInTheDocument();
    expect(formEls.confirmPass).toBeInTheDocument();
    expect(formEls.submit).toBeInTheDocument();

    user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
    user.type(formEls.confirmPass, CHANGE_PASS_INPUT_MATCH.confirmPass);
    expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
    expect(formEls.confirmPass.value).toBe(CHANGE_PASS_INPUT_MATCH.confirmPass);

    await act(async () => {
      formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockHistoryReplace).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplace).toHaveBeenCalledWith("/");

  });

  it("test if passwords don't match to throw error", async () => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(CHANGE_PASS_MOCK_RES),
      })
    );
    const history = createMemoryHistory({
      initialEntries: ["/changePassword/HERESATOKEN"]
    });

    render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <ChangePassword />
            <HiddenLocationDisplay />
          </Router>
        </Provider>
      </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

    const formEls = {
      newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
      confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
      submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(formEls.newPass).toBeInTheDocument();
    expect(formEls.confirmPass).toBeInTheDocument();
    expect(formEls.submit).toBeInTheDocument();

    user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
    user.type(formEls.confirmPass, "not matching");
    expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
    expect(formEls.confirmPass.value).toBe("not matching");

    await act(async () => {
      formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockHistoryReplace).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(0);
    // expect(mockHistoryReplace).toHaveBeenCalledWith("/");
    expect(screen.getByTestId("error-message").textContent).toBe("Passwords do not match.");

  });

  it("test if api error appears", async () => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 400,
      })
    );
    const history = createMemoryHistory({
      initialEntries: ["/changePassword/HERESATOKEN"]
    });

    render(
      <>
        <Provider store={store}>
          <Router history={history}>
            <ChangePassword />
            <HiddenLocationDisplay />
          </Router>
        </Provider>
      </>
    );
    expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

    const formEls = {
      newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
      confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
      submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(formEls.newPass).toBeInTheDocument();
    expect(formEls.confirmPass).toBeInTheDocument();
    expect(formEls.submit).toBeInTheDocument();

    user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
    user.type(formEls.confirmPass, CHANGE_PASS_INPUT_MATCH.confirmPass);
    expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
    expect(formEls.confirmPass.value).toBe(CHANGE_PASS_INPUT_MATCH.confirmPass);

    await act(async () => {
      formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockHistoryReplace).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(1);

    // expect(mockHistoryReplace).toHaveBeenCalledWith("/");

  });

});


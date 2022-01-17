// @ts-ignore
import React from "react";
import ChangePassword from "../../pages/ChangePassword";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { CHANGE_PASS_INPUT_MATCH, CHANGE_PASS_MOCK_RES, } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";


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


// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("need to implement window methods here", () => {
  
  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore need to redefine prop for jest
    delete window.location;
    // console.log("checking window location", window.location);
    // @ts-ignore need to redefine prop for jest
    window.location = {
      //for the dynamic setting of the urlparams state for the token arg to change pass api call
      pathname: "testkjdfdjkf/tksjkd/HERESATOKEN",
      assign: jest.fn(() => {
        return void 0;
      })
    };
    // console.log("checking window location", window.location);
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(CHANGE_PASS_MOCK_RES),
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });


  it("render the change password page", async () => {

    render(
      <>
        <Provider store={store}>
          <ChangePassword />
        </Provider>
      </>
    );

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

    expect(window.location.assign).toHaveBeenCalledTimes(1);

  });
});


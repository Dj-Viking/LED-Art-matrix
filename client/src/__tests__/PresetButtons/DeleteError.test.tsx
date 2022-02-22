/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { MOCK_PRESETS, MOCK_SIGN_TOKEN_ARGS } from "../../utils/mocks";

const store = createStore(allReducers);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };


describe("test deleting a preset from the user's preset button list", () => {
  it.only("enables a delete function to allow clicking a preset that deletes it, checks if user wants to delete the preset first", async () => {
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
    expect(typeof localStorage.getItem("id_token")).toBe("string");
    const history = createMemoryHistory();

    const fakeFetchRes = (value: any): Promise<{ status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value)});

    const fakeMockAddFail = (value: any): Promise<{ status: 500, json: () => 
        Promise<any>; }> => Promise.resolve({ status: 500, json: () => Promise.resolve(value)});

    const mockFetch = jest.fn()
                      //default
                      // .mockReturnValue("kdfjkdj")
                      // first
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
                      // second
                      .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" } }))
                      // third
                      .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" } }))
                      // fourth
                      .mockReturnValueOnce(fakeMockAddFail({ error: "error" }));
    // @ts-ignore
    global.fetch = mockFetch;
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
    expect(fetch).toHaveBeenCalledTimes(2); // /user/presets first /user second
    // expect(fetch).toHaveBeenNthCalledWith(1, "dkfkdfjkd"); // /user/presets first /user second
    // expect(fetch).toHaveBeenNthCalledWith(2, "dkfkdfjkd"); // /user/presets first /user second

    expect((await screen.findByTestId("buttons-parent")).children).toHaveLength(14);

    const deleteBtn = await screen.findByTestId("deletePreset");
    
    expect(deleteBtn.textContent).toBe("Delete A Preset");
    act(() => {
      deleteBtn.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    expect(deleteBtn.textContent).toBe("Don't Delete A Preset");

    const bogus = await screen.findByTestId("bogus");

    expect(bogus.classList.length).toBe(1);
    expect(bogus.classList[0]).toBe("preset-delete-mode");

    act(() => {
      bogus.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    const deleteModal = screen.getByTestId("delete-modal");

    expect(deleteModal.parentElement!.style.display).toBe("flex");

    const cancel = screen.getByTestId("modal-cancel-button");
    const confirm = screen.getByTestId("modal-confirm-button");

    act(() => {
      cancel.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(deleteModal.parentElement!.style.display).toBe("none");

    // TODO: finish the front and back portion of the button actually being deleted from the list.

    expect(deleteBtn.textContent).toBe("Delete A Preset");
    act(() => {
      deleteBtn.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    expect(deleteBtn.textContent).toBe("Don't Delete A Preset");

    expect(bogus.classList.length).toBe(1);
    expect(bogus.classList[0]).toBe("preset-delete-mode");

    act(() => {
      bogus.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(deleteModal.parentElement!.style.display).toBe("flex");

    await act(async () => {
      confirm.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(fetch).toHaveBeenCalledTimes(4);
    // expect(fetch).toHaveBeenNthCalledWith(3, "dkjfdkj");
    expect(fetch).toHaveBeenNthCalledWith(4, 
      "http://localhost:3001/user/delete-preset", 
      {
        "body": expect.any(String), 
        "headers": {
          "Content-Type": "application/json", 
          "authorization": expect.any(String)
        },
        "method": "DELETE"
      }
    );
    expect((await screen.findByTestId("buttons-parent")).children).toHaveLength(14);

    expect((await screen.findByTestId("delete-error"))).toBeInTheDocument();
  
  });
});
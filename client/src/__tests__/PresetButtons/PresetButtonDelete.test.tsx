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
import "@jest/types";
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
  it("enables a delete function to allow clicking a preset that deletes it, checks if user wants to delete the preset first", async () => {
    expect(localStorage.getItem("id_token")).toBe(null);
    localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
    expect(typeof localStorage.getItem("id_token")).toBe("string");
    const history = createMemoryHistory();

    const fakeFetchRes = (value: any): Promise<{ status: 200, json: () => 
      Promise<any>; }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value)});
    const mockFetch = jest.fn()
                      //default
                      // .mockReturnValue("kdfjkdj")
                      // first
                      .mockReturnValueOnce(fakeFetchRes({ preset: "" }))
                      // second
                      .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }));
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
    expect(screen.getByTestId("location-display").textContent).toBe("/asdfas");
    expect(fetch).toHaveBeenCalledTimes(0);
  });
});
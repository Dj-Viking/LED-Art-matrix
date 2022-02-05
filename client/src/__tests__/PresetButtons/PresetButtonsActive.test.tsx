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

const store = createStore(allReducers);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };


describe("test the preset buttons are becoming active and inactive and clearing active status when clear button clicked", () => {
  it("tests page renders", () => {
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

    const btnsParent = screen.getByTestId("buttons-parent");
    expect(btnsParent.children).toHaveLength(7);

    const waves = screen.getByTestId("waves");

    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    // check the style of the button is active
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");
    
    const v2 = screen.getByTestId("v2");
    
    act(() => {
      v2.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    
    expect(screen.getByTestId("v2").classList).toHaveLength(1);
    expect(screen.getByTestId("v2").classList[0]).toBe("preset-button-active");
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-inactive");
    
    const clear = screen.getByTestId("clear");
    
    act(() => {
      clear.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    
    expect(screen.getByTestId("v2").classList).toHaveLength(1);
    expect(screen.getByTestId("v2").classList[0]).toBe("preset-button-inactive");
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-inactive");
    
    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });
    
    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");
    
    
    act(() => {
      waves.dispatchEvent(TestService.createBubbledEvent("click"));
    });

    expect(screen.getByTestId("waves").classList).toHaveLength(1);
    expect(screen.getByTestId("waves").classList[0]).toBe("preset-button-active");

  });
});
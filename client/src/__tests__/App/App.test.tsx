// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

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

afterEach(cleanup);

describe("test rendering the app and snapshot", () => {
  it("tests the app renders (simulating index.tsx I suppose)", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it("matches snapshot DOM node structure", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

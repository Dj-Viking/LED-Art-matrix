// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import { render, cleanup } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

describe("Tests root app page i guess", () => {
  it("renders", () => {
    render(<App />);
  });

  it("matches snapshot DOM node structure", () => {
    const { asFragment } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
  });
});

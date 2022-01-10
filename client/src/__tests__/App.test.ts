import React from "react";
import App from "../App";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { describe } from "mocha";

afterEach(cleanup);

describe("Tests root app page i guess", () => {
  it("renders", () => {
    render(<App />);
  })
});
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@jest/types";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { TestService } from "../../utils/TestServiceClass";
import { act } from "react-dom/test-utils";

const store = createStore(allReducers);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

describe("test art scroller turning on with gifs", () => {
  beforeEach(() => {
    // @ts-ignore mock fetch
    global.fetch = jest.fn(() => {// res { status, json } 
      return Promise.resolve({
        status: 200,
        json: () => {//data { gifs }
          return Promise.resolve({
            gifs: [
              {
                gifCategory: "trippy",
                gifSrc: "https://media2.giphy.com/media/9MJ65OWvrNIXnOiNEk/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g",
                limit: "10",
                __v: 0,
                _id: "61eb059eb7b933276390e80f",
              },
            ],
          });
        },
      });
    });
  });
  afterEach(() => {
    cleanup();
  });
  it("checks artscroller is rendering the gifs", async () => {
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
    
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    const startBtn = screen.getByTestId("start-art");
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).not.toBeDisabled();

    await act(async () => {
      startBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/gifs/get", 
      {
        "headers": {
          "Content-Type": "application/json"
        }, 
        "method": "GET"
      }
    );

    expect(screen.getByTestId("gif-0")).toBeInTheDocument();
    
    
  });

  it("tests the sliders change the artscrollers style values", async () => {
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
    
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");

    const startBtn = screen.getByTestId("start-art");
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).not.toBeDisabled();

    await act(async () => {
      startBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/gifs/get", 
      {
        "headers": {
          "Content-Type": "application/json"
        }, 
        "method": "GET"
      }
    );
                                      
    expect(screen.getByTestId("gif-0")).toBeInTheDocument();
    expect(screen.getByTestId("gif-0").id).toBe("gif-0");

    const gifRef = screen.getByTestId("gif-0");
    //check classes of the gif image
    expect(gifRef.classList.length).toBe(1);
    expect(gifRef.classList[0]).toBe("scroller-media");
    expect(typeof gifRef.style).toBe("object");
    //parse parameters out of the dynamic stylesheet on the art scroller gif item
    const gifStyleRef = gifRef.style;
    let styleValues = TestService.getGifStyles(gifStyleRef);

    expect(styleValues.values).toHaveProperty("animation-duration");
    expect(styleValues.values).toHaveProperty("filter");
    expect(styleValues.values).toHaveProperty("top");
    expect(styleValues.values).toHaveProperty("width");
    expect(styleValues.values).toHaveProperty("left");

    //INTERACT WITH SLIDERS
    const sliders = {
      circleWidth: screen.getByTestId("circle-width"),
      vertPos: screen.getByTestId("vert-pos"),
      left: screen.getByTestId("horiz-pos"),
      invert: screen.getByTestId("invert"),
      scrollSpeed: screen.getByTestId("anim-duration"),
    };
        
    expect(sliders.circleWidth).toBeInTheDocument();
    expect(sliders.vertPos).toBeInTheDocument();
    expect(sliders.left).toBeInTheDocument();
    expect(sliders.invert).toBeInTheDocument();
    expect(sliders.scrollSpeed).toBeInTheDocument();

    // act(() => {
    //   //click and drag????
    // });

  });
});